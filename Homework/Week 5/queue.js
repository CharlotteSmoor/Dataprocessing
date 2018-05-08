window.onload = function() {
};

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

var stadsdeel = {"A": "Centrum","B": "Westpoort", "E": "West", "M": "Oost", "K": "Zuid", "F": "Nieuw west", "N": "Noord", "T": "Zuidoost"}

var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
    colorStadsdelen = d3.scaleOrdinal(d3.schemePastel2); //d3.schemeGreys
    colorLines = d3.scaleSequential(d3.schemeCategory20);

svg.append("text")
  .attr("x", 0)
  .attr("y", 15)
  .attr("font-size", "large")
  .attr("text-decoration", "underline")
  .attr("font-weight", "bold")
  .text("Cafés en restaurants in Amsterdam");

var y0 = 30;
var spacingy = 20
var x0 = 5
var spacingx = 55

d3.queue()
  .defer(d3.json, 'EtenDrinken.json')
  .defer(d3.json, 'sbk_code_stadsdeel.json')
  .defer(d3.json, 'sbk_postcode_stadsdeel.json')
  .awaitAll(ready);

  //data from stadsdelen: https://www.amsterdam.nl/stelselpedia/bag-index/producten-bag/productspecificatie-5/
  //data from restaurants: https://data.amsterdam.nl/#?dte=catalogus%2Fapi%2F3%2Faction%2Fpackage_show%3Fid%3Da968ab7f-d891-4502-b103-0f78dcc58fb8&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945
var stadsdeel = {"A": "Centrum","B": "Westpoort", "E": "West", "M": "Oost", "K": "Zuid", "F": "Nieuw west", "N": "Noord", "T": "Zuidoost"}

function ready(error, buurten) {
  if (error) throw error;

  d3.json('buurten.json', function(error, buurten) {

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
