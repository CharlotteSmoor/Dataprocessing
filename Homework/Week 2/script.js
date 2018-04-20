let data = document.getElementById("rawdata").outerHTML.split(/\n/);
//console.log(data);

let dates = [];
let temps = [];

// split in two chunks
for (let i = 1; i < data.length - 1; i++) {
  let split = data[i].split(",");

  let datum = split[0].trim();
  let temp = parseInt(split[1]);

  let year = datum.slice(0,4);
  let month = datum.slice(4,6) - 1;
  let day = datum.slice(6,8);
  let date = new Date(year, month, day);

  dates.push(date)
  temps.push(temp)
}
console.log(temps)

if (document.getElementById('myCanvas')) {

  // create canvas for graph
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  // x-axis
  ctx.beginPath();
  ctx.moveTo(50, 500);
  ctx.lineTo(597.5, 500);
  ctx.stroke();

  // y-axis
  ctx.beginPath();
  ctx.moveTo(50, 125);
  ctx.lineTo(50, 557);
  ctx.stroke();

  // text for the x axis
  for (let i = 0; i < 8; i ++)
  {
  	ctx.fillText(eval("i * 50"), 50 + i * 50 * 1.5, 520);
  }

  for (let i = 0; i < 6; i++)
  {
    ctx.beginPath();
    ctx.moveTo(50, 500 - i * 50 * 1.5);
    ctx.lineTo(597.5, 500 - i * 50 * 1.5);
    ctx.stroke();
    ctx.fillText(eval("i * 5"), 30, 500 - i * 50 * 1.5);
  }

  // draw graph with temperatures and dates
  ctx.beginPath();

  // draw first datapoint
  let y = 0
  let x = temps[0]
  ctx.moveTo(50 + 1.5 * y, 500 - 1.5 * x);
  ctx.fillText("0", 30, 500);

  // drawing other datapoints
  for (let i = 1; i < data.length - 1 ; i++) {
  	x = temps[i];
  	y = i;
  	ctx.lineWidth = 1;
  	ctx.lineTo(50 + 1.5 * y, 500 - 1.5 * x);
  }

  ctx.strokeStyle = "red";
  ctx.stroke();

  // graph info
  ctx.font = "14px Times New Roman"
  ctx.fillText("Charlotte Smoor", 575, 20);
  ctx.fillText("Line graph with Javascript", 575, 35);
  ctx.fillText("Data: projects.knmi.nl", 575, 50);

  // graph and axis titles
  ctx.font = "20px Times New Roman";
  ctx.fillText("Average temperature in the Bilt 2015", 180, 50);
  ctx.fillText("Time (in days)", 260, 550);
  ctx.rotate((-90 * Math.PI)/ 180);
  ctx.fillText("Temperature (in Celsius)", -420, 25);

}
//   var canvas = document.getElementById('myCanvas');
//   var ctx = canvas.getContext('2d');
//
//   ctx.fillStyle = 'rgb(200,0,0)';
//
//   // draw y-axis temperature and x-axis date
//   ctx.beginPath();
//   ctx.moveTo(40,40);
//   ctx.lineTo(40,500);
//   ctx.lineTo(800,500);
//   ctx.stroke();
//   ctx.fillText("Temperature", 0, 20);
//   ctx.fillText("Date", 810, 500);
//
//   let min_date = Math.min.apply(Math, dates);
//   let max_date = Math.max.apply(Math, dates);
//
//   // determine domain and range for date
//   var domain = [min_date, max_date];
//
//   // calculate min and max for temperature
//   let min_temp = Math.min.apply(Math, temps);
//   let max_temp = Math.max.apply(Math, temps);
//   console.log(min_temp);
//
//
//
//   // determine domain and range for temperature
//   var range = [min_temp, max_temp];
//
//   // transformation for temperature
//
//
//   function createTransform(domain, range){
//     var domain_min = domain[0]
//     var domain_max = domain[1]
//     var range_min = range[0]
//     var range_max = range[1]
//
//     // formulas to calculate the alpha and the beta
//    	var alpha = (range_max - range_min) / (domain_max - domain_min)
//     var beta = range_max - alpha * domain_max
//
//     // returns the function for the linear transformation (y= a * x + b)
//     return function(x){
//       return alpha * x + beta;
//     }
// }
//
// var transform = createTransform(domain, range);
//
//
// // create functions to calculate coordinates for graph
// dayDomain = [0, (data.length - 1)];
// dayRange = [100, 640];
// var day = createTransform(dayDomain, dayRange);
//
// temperatureDomain = [lowestTemp, highestTemp];
// temperatureRange = [graphStartY, graphEndY];
// var temperature = createTransform(temperatureDomain, temperatureRange);
//
//   // draw line graph
//   ctx.beginPath();
//   ctx.moveTo(transform(dates[0]),transform(temps[0]));
//   for (let i = 0; i < dates.length; i++){
//       ctx.lineTo(transform(dates[i]), transform(temps[i]));
//   }
//   ctx.stroke();
//
//
// }
