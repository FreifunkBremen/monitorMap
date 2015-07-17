var announced = require('../announced');
var models = require('../models');
var config = require('../../config/environment');

var rrd = require('./rrd');

var intervalObj,io;

var _init = function(){
	clearInterval(intervalObj);

	var loop = function(){
		models.Node.findAll({}).then(function(nodes){
			announced(function(data){
				if(data.length>0){
				for(var i in data){
					if(data[i].node_id){
						var exists = false;
						for(var j in nodes){
							if(data[i].node_id == nodes[j].mac.split(":").join('')){
								exists = true;
								tmp ={
									mac:data[i].network.mac,
									status:true
									};
								nodes[j].updateAttributes(tmp).then(function(){
									nodes[j].release = data[i].software.release;
									io.emit('monitormap:node:change',nodes[j]);
								});
							}
						}

						// Exists
						if(!exists){
							tmp = {
								mac:data[i].network.mac,
								name:data[i].network.mac.split(":").join(''),
								status:true
								}

							models.Node.create(tmp,{ignoreDuplicates: true}).then(function(node){
								tmp.createdAt = (new Date()).getTime();
								tmp.updatedAt = (new Date()).getTime();
								tmp.release = data[i].software.release;
								io.emit('monitormap:node:change',tmp);
							});
						}
						//exist Ende
					}
				}


			}
				//annouce+models ENDE
			},'nodeinfo');
		});
	}
	intervalObj = setInterval(loop,(config.scanner.timer_announce_find+2)*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
