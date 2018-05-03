'use strict';
window.onload = function() {

};
var data2015 = "http://stats.oecd.org/SDMX-JSON/data/AIR_GHG/AUS+CAN+FRA+DEU+JPN+NLD+ESP+GBR+USA+RUS.GHG+CO2+CH4+N2O+HFC+PFC+SF6+NF3.ENER_IND+AGR/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
var data2005 = "http://stats.oecd.org/SDMX-JSON/data/AIR_GHG/AUS+CAN+FRA+DEU+JPN+NLD+ESP+GBR+USA+RUS.GHG+CO2+CH4+N2O+HFC+PFC+SF6+NF3.ENER_IND+AGR/all?startTime=2005&endTime=2005&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, data2015)
  .defer(d3.request, data2005)
  .awaitAll(loadinData);

function loadinData(error, response) {
  if (error) throw error;
  var data = []
  for(var i = 0; i < 2; i++){
    var json = response[i].responseText
    var parsed = JSON.parse(json)
    data.push(parsed)

    var dataset = []
    for(var j = 0; j < 10; j++){
      var country = data[i]["structure"]["dimensions"]["observation"]["0"]["values"][j]["name"]
      var energy_used = data[i]["dataSets"]["0"]["observations"][j + ":0:0:0"][0]
      var agriculture = data[i]["dataSets"]["0"]["observations"][j + ":0:1:0"][0]
      dataset.push({Country: country, Energy: energy_used, Agriculture: agriculture})
      //console.log(dataset)
    };
  }
    //console.log(data);
    console.log(data);

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 40, left: 70},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(dataset, function(d) { return d.Energy; }));
    y.domain([0, d3.max(dataset, function(d) { return d.Agriculture; })]);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(dataset)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.Energy); })
        .attr("cy", function(d) { return y(d.Agriculture); });

    // Add the X Axis
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

    // Add the Y Axis
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
     .style("fill", function(d) { return color(d.Country); });

// legend implementation
// inspired by https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
     var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 40 )
      .attr("y", 20)
      .attr("width", 18)
      .attr("height", 14)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 50)
      .attr("y", 26)
      .attr("dy", ".40em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  // d3.select("p")
  //   .on("click", function(){
  //     var update = response[1].responseText
  //     var parse_updated = JSON.parse(update)
  //     console.log(parse_updated)
  //
  //     var new_dataset = []
  //     for(var i = 0; i < 10; i++){
  //       var country = parse_updated["structure"]["dimensions"]["observation"]["0"]["values"][i]["name"]
  //       var energy_used = parse_updated["dataSets"]["0"]["observations"][i + ":0:0:0"][0]
  //       var agriculture = parse_updated["dataSets"]["0"]["observations"][i + ":0:1:0"][0]
  //       new_dataset.push({Country: country, Energy: energy_used, Agriculture: agriculture})
  //     };
  //
  //   // Scale the range of the data
  //   x.domain(d3.extent(dataset, function(d) { return d.Energy; }));
  //   y.domain([0, d3.max(dataset, function(d) { return d.Agriculture; })]);
  //
  //   svg.selectAll("dot")
  //       .data(new_dataset)
  //       .transition()
  //       .duration(1000)
  //       .enter().append("circle")
  //       .each("start", function(){
  //           d3.select(this)
  //       .attr("r", 5)
  //       .attr("cx", function(d) { return x(d.Energy); })
  //       .attr("cy", function(d) { return y(d.Agriculture); });
  //     }).transition().duration(1000).attr('fill','black')
  //     .attr('r',2);
  //
  //
  //   svg.select('x axis').transition()
  //        .duration('1000').call(x);
  //
  //   svg.select('y axis').transition()
  //       .duration('1000').call(y);
  // });

  };
