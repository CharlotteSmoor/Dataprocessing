window.onload = function() {
};

// setting variables of neighbourhoods
var stadsdeel = {"A": "Centrum","B": "Westpoort", "E": "West", "M": "Oost", "K": "Zuid", "F": "Nieuw west", "N": "Noord", "T": "Zuidoost"}
var stadsdelen = ["A","B", "E", "M", "K", "F", "N", "T"];

// setting variables for color
var color = d3.scaleOrdinal(d3.schemeCategory20)
var color2 = d3.scaleOrdinal(d3.schemeCategory20)

// load in data using queue
d3.queue()
  .defer(d3.json, 'EtenDrinken.json')
  .defer(d3.json, 'sbk_postcode_stadsdeel.json')
  .awaitAll(load_data);

// make data ready for use
  function load_data(error, data){
    d3.json('EtenDrinken.json', function(error, horeca) {
      d3.json('sbk_postcode_stadsdeel.json', function(error, postcode) {

      var buurten_list = []
      for (var h = 0; h < stadsdelen.length; h++ ){
        var count = 0;

        // compares zipcodes of restaurants to zipcodes of neighbourhoods
        for (var i = 1; i < horeca.length; i++){
          for (var j = 1; j < postcode.length; j++){
            if (postcode[j]["stadsdeel"] == stadsdelen[h]){
              if ((horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_min"]) == 1 &&
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_max"]) == -1) ||
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_min"]) == 0 ||
                  horeca[i]["zipcode"].replace(/\s/g,'').localeCompare(postcode[j]["postcode_max"]) == 0){
                    //var buurt_code = stadsdelen[h];
                    var buurt = stadsdeel[stadsdelen[h]]
                    count++;
                }
              }
          }
        }
        buurten_list.push({Buurt : buurt, Restaurants : count})
    }

  make_map(buurten_list)
})
})
}

// creates map of Amsterdam
// implementation of map inspired by https://github.com/JulesBlm/RailAmsterdam
function make_map(buurten_list) {
  d3.json('buurten.json', function(error, buurten) {
    if (error) throw error;

    var data_buurten = topojson.feature(buurten, buurten.objects.buurten).features

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

  // draws neighbourhoods
  svg.selectAll(".buurt")
      .data(data_buurten)
    .enter().insert("g")
      .append("path")
        .attr("class", "buurt")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.properties.Stadsdeel_code[0]) })
      .append("title")
        .text(function(d) { return stadsdeel[d.properties.Stadsdeel_code] + ": " + d.properties.Buurtcombinatie });


  // draws borders around neighbourhoods
  svg.append("path")
      .attr("class", "buurt-borders")
      .attr("d", path(topojson.mesh(buurten, buurten.objects.buurten, function(a, b) { return a !== b; })));

  // draws borders around districts
  svg.append("path")
      .attr("class", "stadsdeel-borders")
      .attr("d", path(topojson.mesh(buurten, buurten.objects.buurten, function(a, b) { return stadsdeel[a.properties.Stadsdeel_code] !== stadsdeel[b.properties.Stadsdeel_code]; })));

  build_barchart(buurten_list)

  svg.on("click", function() {
    update_barchart(buurten_list)

  })
});

// creates barchart
function build_barchart(buurten_list){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // setting x and y-axes
      var x = d3.scaleBand()
      			.range([0, width], .1);

      var y = d3.scaleLinear()
          .range([height, 0]);

      var xAxis = d3.axisBottom(x);

      var yAxis = d3.axisLeft(y)
          .ticks(10);

      var svg = d3.select("body")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) { return "Restaurants: " + d.Restaurants; });
          svg.call(tool_tip);

        x.domain(buurten_list.map(function(d) { return d.Buurt; }))
        	.paddingInner(0.1)
        	.paddingOuter(0.5);

        y.domain([0, d3.max(buurten_list, function(d) { return d.Restaurants; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "xaxis")
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
            .attr("id", "yaxis")
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
            .attr("id", "bar")
            .attr("x", function(d) { return x(d.Buurt); })
            .attr("width", x.bandwidth())
            .attr("fill", function(d) { return color2(d.Buurt); })
            .attr("y", function(d) { return y(d.Restaurants); })
            .attr("height", function(d) { return height - y(d.Restaurants); })
            .on('mouseover', tool_tip.show)
            .on('mouseout', tool_tip.hide);

}

    // updates barchart
    function update_barchart(){

      // inspired by http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
      var active   = bar.active ? false : true,
            newOpacity = active ? 0 : 1;

          // hides or shows barchart
          d3.selectAll(".bar").style("opacity", newOpacity);
          d3.selectAll("#xaxis").style("opacity", newOpacity);
          d3.selectAll("#yaxis").style("opacity", newOpacity);

          bar.active = active;
    }
	};
