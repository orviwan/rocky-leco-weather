var rocky = require('rocky');

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 
  'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var weather = null;

rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  var obstruction_h = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  var d = new Date();
  ctx.fillStyle = 'white';

  // TIME
  var clockTime = leftpad(d.getHours(), 2, 0) + ':' + 
                    leftpad(d.getMinutes(), 2, 0); // TODO: Detect 24h
  ctx.font = '42px bold numbers Leco-numbers';
  ctx.textAlign = 'center';
  ctx.fillText(clockTime, w / 2, 56 - obstruction_h);

  // DATE
  ctx.fillStyle = 'lightgray';
  var clockDate = dayNames[d.getDay()] + ' ' + d.getDate() + ' ' + 
                    monthNames[d.getMonth()] + ', ' + d.getFullYear();
  ctx.font = '18px bold Gothic';
  ctx.textAlign = 'center';
  ctx.fillText(clockDate, w / 2, 100 - obstruction_h);

  // COLON BLINK MASK
  if (!(d.getSeconds() % 2)) {
    ctx.fillStyle = 'black';
    ctx.fillRect(66, 72 - obstruction_h, 12, 26);
  }

  // WEATHER
  if (weather!==null) {
    ctx.fillStyle = 'white';
    var weatherText = weather.city.substr(0, 10) + '\n' + weather.temp + 
                        'c - ' + weather.condition;
    ctx.font = '18px bold Gothic';
    ctx.textAlign = 'center';
    ctx.fillText(weatherText, w / 2, 23 - obstruction_h);
  }

});

rocky.on('message', function(event) {
  weather = event.data;
});

rocky.on('secondchange', function(e) {
  rocky.requestDraw();
});

rocky.on('hourchange', function(e) {
  rocky.postMessage({command: 'weather'});
});

function leftpad(str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}
