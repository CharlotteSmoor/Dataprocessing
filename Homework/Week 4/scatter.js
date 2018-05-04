window.onload = function() {

};

var alldata = "http://stats.oecd.org/SDMX-JSON/data/AIR_GHG/AUS+CAN+FRA+DEU+JPN+NLD+ESP+GBR+USA+RUS.GHG+CO2+CH4+N2O+HFC+PFC+SF6+NF3.ENER_IND+AGR/all?startTime=2010&endTime=2015&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, alldata)
  .awaitAll(loadinData);

function loadinData(error, response) {
  if (error) throw error;
  var data = []
    var json = response[0].responseText
    var parsed = JSON.parse(json)
    data.push(parsed)
    console.log(data);
    var dataset = []
    for(var year = 0; year < 6; year++){
      for(var j = 0; j < 10; j++){
        var country = data["0"]["structure"]["dimensions"]["observation"]["0"]["values"][j]["name"]
        var energy_used = data["0"]["dataSets"]["0"]["observations"][j + ":0:0:" + year][0]
        var agriculture = data["0"]["dataSets"]["0"]["observations"][j + ":0:1:" + year][0]
        dataset.push({Year: "201" + year,Country: country, Energy: energy_used, Agriculture: agriculture})
      }
    };

    // set the dimensions and margins of the scatterplot
    var margin = {top: 20, right: 20, bottom: 40, left: 70},
    fullwidth = 800,
    fullheight = 600,
    width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // implementation of tooltip
    var tip = d3.tip()
       .attr("class", "d3-tip")
       .offset([-10, 0])
       .html(function(d) {
           return "<strong>Year: </strong>" + d.Year + "<br>" +
           "<strong>Country: </strong>" + d.Country + "<br>" +
           "<strong>Energy Industry: </strong>" + d.Energy + "<br>" +
           "<strong>Agriculture: </strong>" + d.Agriculture;
       });

    // create SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
        svg.call(tip);

    // scale the range of the data
    x.domain(d3.extent(dataset, function(d) { return d.Energy; }));
    y.domain([0, d3.max(dataset, function(d) { return d.Agriculture; })]);

    // add scatterplot
    svg.selectAll("dot")
        .data(dataset)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.Energy); })
        .attr("cy", function(d) { return y(d.Agriculture); })

    // add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    // text label for the x axis
    svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," + (height + margin.top + 7.5)   + ")")
    .style("text-anchor", "middle")
    .text("Greenhouse gas emission by energy industries");

    // add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y))

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Greenhouse gas emission by agriculture");

    svg.selectAll(".dot")
         .data(dataset)
       .enter().append("circle")
         .attr("class", "dot")
         .attr("r", 8)
         .attr("cx", function(d) { return x(d.Energy); })
         .attr("cy", function(d) { return y(d.Agriculture); })
         .style("fill", function(d) { return color(d.Country); })
         .on("mouseover", tip.show)
         .on("mouseout", tip.hide);


      // implementation of legend
      // inspired by https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
     var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width  )
          .attr("y", 150)
          .attr("width", 18)
          .attr("height", 14)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 10)
          .attr("y", 150)
          .attr("dy", ".40em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

  };
