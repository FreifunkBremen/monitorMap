var models = require('../models');
var RRD = require('../rrd');
var fs = require('fs');

var rrdList = [];
var steps = 60;
var createParam = ['-s',steps];
var config = {
	node:{
		ds:[
				'DS:upstate:GAUGE:120:0:1',
				'DS:clients:GAUGE:120:0:NaN',
				'DS:clients24:GAUGE:120:0:NaN',
				'DS:clients50:GAUGE:120:0:NaN',
				'DS:load:GAUGE:120:0:NaN',
				'DS:uptime:DERIVE:120:0:NaN',
				'DS:rx_bytes:DERIVE:120:0:NaN',
				'DS:rx_packets:DERIVE:120:0:NaN',
				'DS:tx_bytes:DERIVE:120:0:NaN',
				'DS:tx_packets:DERIVE:120:0:NaN',
				'DS:mem_free:DERIVE:120:0:NaN',
				'DS:mem_usage:DERIVE:120:0:NaN',
				'DS:mem_total:DERIVE:120:0:NaN',
				'DS:mem_cached:DERIVE:120:0:NaN',
				'DS:mem_buffers:DERIVE:120:0:NaN',
			],
		rra:['RRA:AVERAGE:0.5:1:1440','RRA:MAX:0.5:1:1440','RRA:AVERAGE:0.5:5:2880','RRA:MAX:0.5:5:2880']
	},
	global:{
		ds:[
				'DS:nodes:GAUGE:120:0:NaN',
				'DS:clients:GAUGE:120:0:NaN',
				'DS:clients24:GAUGE:120:0:NaN',
				'DS:clients50:GAUGE:120:0:NaN',
				'DS:rx_bytes:DERIVE:120:0:NaN',
				'DS:rx_packets:DERIVE:120:0:NaN',
				'DS:tx_bytes:DERIVE:120:0:NaN',
				'DS:tx_packets:DERIVE:120:0:NaN',
				'DS:mem_total:DERIVE:120:0:NaN'
			],
		rra:['RRA:AVERAGE:0.5:1:1440','RRA:MAX:0.5:1:1440','RRA:AVERAGE:0.5:5:2880',,'RRA:MAX:0.5:5:2880']
	}
}
var _create = function(){
	/**
	 * Global
	 */
	exists = false;
	for(var i in rrdList){
		if(rrdList[i].name == 'global'){
			exists = true;
			break
		}
	}
	if(!exists){
		var path = __dirname+'/../../../public/data/global.rrd';
		var tmp = {
			name:'global',
			path:path,
			rrd: new RRD(),
			}
		fs.exists(path, function (is) {
			if(!is)
				tmp.rrd.create(path,createParam,config.global.ds,config.global.rra,function(err){
					if(!err)
						rrdList.push(tmp);
				});
		});
	}
	/**
	* Node
	*/
	models.Node.findAll({}).then(function(nodesList){
		for(var i in nodesList){
			exists = false;
			for(var j in rrdList){
				if(rrdList[j].mac == nodeList[i].mac){
					exists = true;
					break
				}
			}
			if(!exists){
				var name = nodesList[i].mac.split(':').join('');
				var path = __dirname+'/../../../public/data/'+name+'.rrd';
				var tmp = {
					mac:nodesList[i].mac,
					name:name,
					path:path,
					rrd: new RRD(),
					}
				fs.exists(path, function (is) {
					if(!is)
						tmp.rrd.create(path,createParam,config.node.ds,config.node.rra,function(err){
							if(!err)
								rrdList.push(tmp);
						});
				});
			}
		}
	});
}

var _updateGlobal = function(values,fn){
	exists = false;
	for(var i in rrdList){
		if(rrdList[i].name == 'global'){
			exists = rrdList[i];
			break
		}
	}
	if(!exists){
		var path = __dirname+'/../../../public/data/global.rrd';
		exists = {
			name:'global',
			path:path,
			rrd: new RRD(),
			}
		fs.exists(path, function (is) {
			if(!is)
				exists.rrd.create(path,createParam,config.global.ds,config.global.rra,function(err){
					if(!err)
						rrdList.push(exists);
				});
		})
	}
	//TODO
	exists.rrd.update(exists.path,'N',values,fn);
}



var _updateNode = function(values,fn){
	exists = false;
	for(var i in rrdList){
		if(rrdList[i].name == values.node_id){
			exists = rrdList[i];
			break
		}
	}
	if(!exists){
		var path = __dirname+'/../../../public/data/'+values.node_id+'.rrd';
		exists = {
			mac:values.mac,
			name:values.node_id,
			path:path,
			rrd: new RRD(),
			}
		fs.exists(path, function (is) {
			if(!is)
				exists.rrd.create(path,createParam,config.node.ds,config.node.rra,function(err){
					if(!err)
						rrdList.push(exists);
				});
		});
	}
	//TODO
	exists.rrd.update(exists.path,'N',values.values,fn);
}
_create();
module.exports = {init:_create,updateNode:_updateNode,updateGlobal:_updateGlobal};
