var models = require('./models');
var config = require('../config/environment');
var ipv6calc = require('./ipv6calc');
var ping = require("ping-wrapper2");


var io;

var fetchNode = function(node){
  ipv6 = ipv6calc.toIPv6(config.pingipv6,node.mac);
  var exec = ping(ipv6, { count: 20 });
  exec.on("data", function(data){
    // { no: 1, bytes: 64, time: 54, ttl: 1 }
      console.log(data);
  });
  exec.on("exit", function(data){
    console.log(node.name+":"+node.mac);
    console.log(data);
  });
}

var repeat = function(){
  models.Node.findAll({}).then(function(nodeList){
    if(nodeList){
      for(var i in nodeList){
        fetchNode(nodeList[i]);
      }
    }
  });
}

var intervalObj = setInterval(repeat,config.SCAN_TIMER.recv);


var _restart = function(){
  clearInterval(intervalObj);
  intervalObj = setInterval(repeat,config.SCAN_TIMER.recv);
}

module.exports = function(ioInit){
  io = ioInit;
  return {restart:_restart,fetchNode:fetchNode};
}
