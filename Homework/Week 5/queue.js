window.onload = function() {
};

var stadsdelen = ["A","B", "E", "M", "K", "F", "N", "T"];
var stadsdeel = {"A": "Centrum","B": "Westpoort", "E": "West", "M": "Oost", "K": "Zuid", "F": "Nieuw west", "N": "Noord", "T": "Zuidoost"}

var colorScale = d3.scaleOrdinal(d3.schemeCategory20),
    colorStadsdelen = d3.scaleOrdinal(d3.schemeCategory20),
    colorLines = d3.scaleSequential(d3.schemeCategory20);

d3.queue()
  .defer(d3.json, 'EtenDrinken.json')
  .defer(d3.json, 'sbk_code_stadsdeel.json')
  .defer(d3.json, 'sbk_postcode_stadsdeel.json')
  .awaitAll(load_data);

  //data from stadsdelen: https://www.amsterdam.nl/stelselpedia/bag-index/producten-bag/productspecificatie-5/
  //data from restaurants: https://data.amsterdam.nl/#?dte=catalogus%2Fapi%2F3%2Faction%2Fpackage_show%3Fid%3Da968ab7f-d891-4502-b103-0f78dcc58fb8&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945

  function load_data(error, data){
    d3.json('EtenDrinken.json', function(error, horeca) {
      d3.json('sbk_postcode_stadsdeel.json', function(error, postcode) {

      var buurten_list = []
      for (var h = 0; h < stadsdelen.length; h++ ){
        var count = 0;
        for (var i = 1; i < horeca.length; i++){
          for (var j = 1; j < postcode.length; j++){
            if (postcode[j]["stadsdeel"] == stadsdelen[h]){
              if ((horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_min"]) == 1 &&
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_max"]) == -1) ||
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_min"]) == 0 ||
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_max"]) == 0){
                    var buurt = stadsdelen[h];
                    count++;
                }
              }
          }
        }
        buurten_list.push({Buurt : buurt, Restaurants : count})
    }

  //make_map()
  build_barchart(buurten_list)
})
})
}

function make_map(error, data) {
  if (error) throw error;
  d3.json('buurten.json', function(error, buurten) {

    var margin = {top: 40, right: 40, bottom: 40, left: 40};

    var svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var projection = d3.geoAlbers()
      .center([4.9, 52.366667])
      .parallels([51.5, 51.49])
      .rotate(120)
      .scale(250000)
      .translate([width / 2, height / 2]);

    var path = d3.geoPath()
      .projection(projection);

    svg.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("font-size", "large")
      .attr("text-decoration", "underline")
      .attr("font-weight", "bold")
      .text("Map" );

  // Draw the neighbourhoods
  svg.selectAll(".buurt")
      .data(topojson.feature(buurten, buurten.objects.buurten).features)
    .enter().insert("g")
      .append("path")
        .attr("class", "buurt")
        .attr("d", path)
        .attr("fill", function(d) { return colorStadsdelen(d.properties.Stadsdeel_code[0]) })
      .append("title")
        .text(function(d) { return stadsdeel[d.properties.Stadsdeel_code] + ": " + d.properties.Buurtcombinatie });

  // Draw borders around the neighbourhoods
  svg.append("path")
      .attr("class", "buurt-borders")
      .attr("d", path(topojson.mesh(buurten, buurten.objects.buurten, function(a, b) { return a !== b; })));

  // Draw borders around stadsdelen
  svg.append("path")
      .attr("class", "stadsdeel-borders")
      .attr("d", path(topojson.mesh(buurten, buurten.objects.buurten, function(a, b) { return stadsdeel[a.properties.Stadsdeel_code] !== stadsdeel[b.properties.Stadsdeel_code]; })));

})
};

function build_barchart(buurten_list){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x = d3.scaleBand()
      			.range([0, width], .1);

      var y = d3.scaleLinear()
          .range([height, 0]);

      var xAxis = d3.axisBottom(x);

      var yAxis = d3.axisLeft(y)
          .ticks(10);

      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(buurten_list.map(function(d) { return d.Buurt; }))
        	.paddingInner(0.1)
        	.paddingOuter(0.5);
        y.domain([0, d3.max(buurten_list, function(d) { return d.Restaurants; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 100) + ")")
            .style("text-anchor", "middle")
              .text("Neighbourhoods in Amsterdam");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Number of horeca places");

        svg.selectAll(".bar")
            .data(buurten_list)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Buurt); })
            .attr("width", x.bandwidth())
            .attr("fill", function(d) { return colorStadsdelen(d.Buurt) })
            .attr("y", function(d) { return y(d.Restaurants); })
            .attr("height", function(d) { return height - y(d.Restaurants); });

            var legend = svg.selectAll(".legend")
             .data(colorScale.domain())
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

             legend.append("rect")
                 .attr("x", width  )
                 .attr("y", 150)
                 .attr("width", 18)
                 .attr("height", 14)
                 .style("fill", colorScale);

             legend.append("text")
                 .attr("x", width - 10)
                 .attr("y", 150)
                 .attr("dy", ".40em")
                 .style("text-anchor", "end")
                 .text(function(d) { return d.Buurt; });


}
