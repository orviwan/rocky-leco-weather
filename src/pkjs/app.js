var rocky = require('rocky');

var myAPIKey = '9858eb71a058d377abcd05f64763b42b';

rocky.on('message', function(event) {
  if(event.data.command === 'weather') {
    getWeather();
  }
});

function getWeather() {
  window.navigator.geolocation.getCurrentPosition(locationSuccess, 
    locationError, locationOptions);
}

function fetchWeather(latitude, longitude) {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?' +
    'lat=' + latitude + '&lon=' + longitude + '&cnt=1&appid=' + myAPIKey, true);
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        var response = JSON.parse(req.responseText);

        var data = {
          'temp': Math.round(response.main.temp - 273.15),
          'temp_min': Math.round(response.main.temp_min - 273.15),
          'temp_max': Math.round(response.main.temp_max - 273.15),
          'condition': response.weather[0].description,
          'city': response.name
        };
        rocky.postMessage(data);

      } else {
        console.log('Error');
      }
    }
  };
  req.send(null);
}

function locationSuccess(pos) {
  var coordinates = pos.coords;
  fetchWeather(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  var data = {
    'temp': 0,
    'temp_min': 0,
    'temp_max': 0,
    'condition': 'Error',
    'city': 'Unknown'
  };
  rocky.postMessage(data);
}

var locationOptions = {
  'timeout': 15000,
  'maximumAge': 60000
};