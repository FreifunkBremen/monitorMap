var announced = require('./announced');
var announcefind = require('./announcefind');
var alfred = require('./alfred');
var ping = require('./ping');
var downtime = require('./downtime');

var meshviewer = require('./meshviewer');



module.exports = function(io){
  announced(io);
  announcefind(io);
  downtime(io);
  meshviewer.init();

  return;
}
