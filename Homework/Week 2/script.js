let data = document.getElementById("rawdata").outerHTML.split(/\n/);

let dates = [];
let temps = [];

// split into two chunks
for (let i = 1; i < data.length - 1; i++) {
  let split = data[i].split(",");

  let datum = split[0].trim();
  let temp = parseInt(split[1]);

  // convert data string to javascript dates
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

  // x-axis, range is 365 and range after transformation (*1.5) is 547.5
  ctx.beginPath();
  ctx.moveTo(50, 500);
  ctx.lineTo(597.5, 500);
  ctx.stroke();

  // y-axis, range is 262,8 and range after transformation (* 1.5) is 394,2
  ctx.beginPath();
  ctx.moveTo(50, 125);
  ctx.lineTo(50, 557);
  ctx.stroke();

  // x-axis text
  for (let i = 0; i < 8; i ++) {
  	ctx.fillText(eval("i * 50"), 50 + i * 50 * 1.5, 520);
  }

  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(50, 500 - i * 50 * 1.5);
    ctx.lineTo(597.5, 500 - i * 50 * 1.5);
    ctx.stroke();
    ctx.fillText(eval("i * 5"), 30, 500 - i * 50 * 1.5);
  }

  // draw graph
  ctx.beginPath();

  // draw first datapoint
  let x_axe = temps[0]
  let y_axe = 0
  ctx.moveTo(50 + 1.5 * y_axe, 500 - 1.5 * x_axe);
  ctx.fillText("0", 30, 500);

  // drawing other datapoints
  for (let i = 1; i < data.length - 1 ; i++) {
    y_axe = i;
  	x_axe = temps[i];
  	ctx.lineTo(50 + 1.5 * y_axe, 500 - 1.5 * x_axe);
  }

  ctx.strokeStyle = "red";
  ctx.stroke();

  // graph and axis titles
  ctx.font = "22px Times New Roman";
  ctx.fillText("Time (days)", 260, 550);
  ctx.fillText("Average temperature in the Bilt 2015", 180, 50);
  ctx.rotate((-90 * Math.PI)/ 180);
  ctx.fillText("Temperature (Celsius)", -420, 25);

}
