var models = require('../models');
var config = require('../../config/environment');

var intervalObj,io;

var _init = function(){
  clearInterval(intervalObj);

  var loop = function(){
		models.Node.findAll({}).then(function(nodes){
		for(var j in nodes){
			var cur_time = (new Date()).getTime();
			if((new Date(nodes[j].datetime)).getTime() < (cur_time-1000*5) && nodes[j].status)
			  nodes[j].updateAttributes({
			    datetime:cur_time,
			    status:false,
			    client_50:0,
			    client_24:0,
			    traffic_tx_bytes:0,
			    traffic_tx_packets:0,
			    traffic_rx_bytes:0,
			    traffic_rx_packets:0,
			  }).then(function(){
			  //models.Node.update(tmp, {where: {id: nodes[j].id}}).then(function(node){
			    io.emit('monitormap:node:change',nodes[j]);
					console.log("DOWN: "+nodes[j].mac);
			  });
			}
		});
  }
  intervalObj = setInterval(loop,config.scanner.timer_announce*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
