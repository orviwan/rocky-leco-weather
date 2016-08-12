var __loader = (function() {

var loader = {};

loader.packages = {};

loader.packagesLinenoOrder = [{ filename: 'loader.js', lineno: 0 }];

loader.fileExts = ['?', '?.js', '?.json'];
loader.folderExts = ['?/index.js', '?/index.json'];

loader.basepath = function(path) {
  return path.replace(/[^\/]*$/, '');
};

loader.joinpath = function() {
  var result = arguments[0];
  for (var i = 1; i < arguments.length; ++i) {
    if (arguments[i][0] === '/') {
      result = arguments[i];
    } else if (result[result.length-1] === '/') {
      result += arguments[i];
    } else {
      result += '/' + arguments[i];
    }
  }

  if (result[0] === '/') {
    result = result.substr(1);
  }
  return result;
};

var replace = function(a, regexp, b) {
  var z;
  do {
    z = a;
  } while (z !== (a = a.replace(regexp, b)));
  return z;
};

loader.normalize = function(path) {
  path = replace(path, /(?:(^|\/)\.?\/)+/g, '$1');
  path = replace(path, /[^\/]*\/\.\.\//, '');
  path = path.replace(/\/\/+/g, '/');
  path = path.replace(/^\//, '');
  return path;
};

function _require(module) {
  if (module.exports) {
    return module.exports;
  }

  var require = function(path) { return loader.require(path, module); };

  module.exports = {};
  module.loader(module.exports, module, require);
  module.loaded = true;

  return module.exports;
}

loader.require = function(path, requirer) {
  var module = loader.getPackage(path, requirer);
  if (!module) {
    throw new Error("Cannot find module '" + path + "'");
  }

  return _require(module);
};

var compareLineno = function(a, b) { return a.lineno - b.lineno; };

loader.define = function(path, lineno, loadfun) {
  var module = {
    filename: path,
    lineno: lineno,
    loader: loadfun,
  };

  loader.packages[path] = module;
  loader.packagesLinenoOrder.push(module);
  loader.packagesLinenoOrder.sort(compareLineno);
};

loader.getPackageForPath = function(path) {
  return loader.getPackageForFile(path) || loader.getPackageForDirectory(path);
};

loader.getPackage = function(path, requirer) {
  var module;
  var fullPath;
  if (requirer && requirer.filename) {
    fullPath = loader.joinpath(loader.basepath(requirer.filename), path);
  } else {
    fullPath = path;
  }

  // Try loading the module from a path, if it is trying to load from a path.
  if (path.substr(0, 2) === './' || path.substr(0, 1) === '/' || path.substr(0, 3) === '../') {
    module = loader.getPackageForPath(fullPath);
  }

  if (!module) {
    module = loader.getPackageFromSDK(path);
  }

  if (!module) {
    module = loader.getPackageFromBuildOutput(path);
  }

  if (!module) {
    module = loader.getPackageForNodeModule(path);
  }

  return module;
};

loader.getPackageForFile = function(path) {
  path = loader.normalize(path);

  var module;
  var fileExts = loader.fileExts;
  for (var i = 0, ii = fileExts.length; !module && i < ii; ++i) {
    var filepath = fileExts[i].replace('?', path);
    module = loader.packages[filepath];
  }

  return module;
};

loader.getPackageForDirectory = function(path) {
  path = loader.normalize(path);

  var module;
  var packagePackage = loader.packages[loader.joinpath(path, 'package.json')];
  if (packagePackage) {
    var info = _require(packagePackage);
    if (info.main) {
      module = loader.getPackageForFile(loader.joinpath(path, info.main));
    }
  }

  if (!module) {
    module = loader.getPackageForFile(loader.joinpath(path, 'index'));
  }

  return module;
};

loader.getPackageFromSDK = function (path) {
  return loader.getPackageForPath(path);
};

loader.getPackageFromBuildOutput = function(path) {
  var moduleBuildPath = loader.normalize(loader.joinpath('build', 'js', path));

  return loader.getPackageForPath(moduleBuildPath);
};

// Nested node_modules are banned, so we can do a simple search here.
loader.getPackageForNodeModule = function(path) {
  var modulePath = loader.normalize(loader.joinpath('node_modules', path));

  return loader.getPackageForPath(modulePath);
};

loader.getPackageByLineno = function(lineno) {
  var packages = loader.packagesLinenoOrder;
  var module;
  for (var i = 0, ii = packages.length; i < ii; ++i) {
    var next = packages[i];
    if (next.lineno > lineno) {
      break;
    }
    module = next;
  }
  return module;
};

return loader;

})();

__loader.define('rocky', 186, function(exports, module, require) {
module.exports = _rocky;
});
__loader.define('rocky', 189, function(exports, module, require) {
module.exports = _rocky;
});
__loader.define('src/rocky/index.js', 192, function(exports, module, require) {
var rocky = require('rocky');

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 
  'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var weather = null;

var settings = null;

rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  var obstruction_h = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;

  var foregroundColor = 'white';
  var backgroundColor = 'black';

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  ctx.fillStyle = foregroundColor;

  if (settings) {

    foregroundColor = cssColor(settings.ForegroundColor.value);
    backgroundColor = cssColor(settings.BackgroundColor.value);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    ctx.fillStyle = foregroundColor;
  }

  var d = new Date();
  

  // TIME
  var clockTime = leftpad(d.getHours(), 2, 0) + ':' + 
                    leftpad(d.getMinutes(), 2, 0); // TODO: Detect 24h
  ctx.font = '42px bold numbers Leco-numbers';
  ctx.textAlign = 'center';
  ctx.fillText(clockTime, w / 2, 56 - obstruction_h);

  // DATE
  ctx.fillStyle = foregroundColor;
  var clockDate = dayNames[d.getDay()] + ' ' + d.getDate() + ' ' + 
                    monthNames[d.getMonth()] + ', ' + d.getFullYear();
  ctx.font = '18px bold Gothic';
  ctx.textAlign = 'center';
  ctx.fillText(clockDate, w / 2, 100 - obstruction_h);

  // COLON BLINK MASK
  if(settings && settings.Blink.value) {
    if (!(d.getSeconds() % 2)) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(66, 72 - obstruction_h, 12, 26);
    }  
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
  console.log('message: ' + JSON.stringify(event.data));
  //console.log(event.data.BackgroundColor.value);
  //console.log(cssColor(event.data.BackgroundColor.value));
  //weather = event.data;
  settings = event.data;
});

rocky.on('secondchange', function(e) {
  rocky.requestDraw();
});

rocky.on('hourchange', function(e) {
  rocky.postMessage({command: 'settings'});
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

/**
 * @param {string|boolean|number} color
 * @returns {string}
 */
function cssColor(color) {
  if (typeof color === 'number') {
    color = color.toString(16);
  } else if (!color) {
    return 'transparent';
  }

  color = padColorString(color);

  return '#' + color;
}

/**
 * @param {string} color
 * @return {string}
 */
function padColorString(color) {
  color = color.toLowerCase();

  while (color.length < 6) {
    color = '0' + color;
  }

  return color;
}
});
__loader.require('./src/rocky/index');