var announced = require('./announced');
var alfred = require('./alfred');
var ping = require('./ping');
var downtime = require('./downtime');

var meshviewer = require('./meshviewer');



module.exports = function(io){
  announced(io);
  downtime(io);
  meshviewer.init();

  return;
}
