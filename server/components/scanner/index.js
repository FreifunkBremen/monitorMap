var announced = require('./announced');
var announcefind = require('./announcefind');
var alfred = require('./alfred');
var ping = require('./ping');
var downtime = require('./downtime');

var meshviewer = require('./meshviewer');

var config = require('../../config/environment');


module.exports = function(io){
  announced(io);
  announcefind(io);
  if(config.scanner.timer_ping_downtime)
    downtime(io);
  meshviewer.init();

  return;
}
