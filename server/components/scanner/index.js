var announced = require('./announced');
var alfred = require('./alfred');
var ping = require('./ping');
var downtime = require('./downtime');



module.exports = function(io){
  announced(io);
  downtime(io);
  //alfred(io);
  //ping(io);

  return;
}
