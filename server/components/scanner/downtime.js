var models = require('../models');
var config = require('../../config/environment');

var intervalObj,io;

var _init = function(){
  clearInterval(intervalObj);

  var loop = function(){
		models.Node.findAll({include:[
			{model:models.Node,as:'parent'}
		]}).then(function(nodes){
		for(var j in nodes){
			var cur_time = (new Date()).getTime();
			if((new Date(nodes[j].datetime)).getTime() < (cur_time-1000*5) && nodes[j].status)
			  nodes[j].updateAttributes({
          client_24:0,
          client_50:0,
			    status:false
			  }).then(function(){
			  //models.Node.update(tmp, {where: {id: nodes[j].id}}).then(function(node){
			    io.emit('monitormap:node:change',nodes[j]);
					//console.log("DOWN: "+nodes[j].mac);
			  });
			}
		});
  }
  intervalObj = setInterval(loop,(config.scanner.timer_announce)*10*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
