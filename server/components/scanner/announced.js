var announced = require('../announced');
var models = require('../models');
var config = require('../../config/environment');

var rrd = require('./rrd');

var intervalObj,io;

var _init = function(){
	clearInterval(intervalObj);

	var loop = function(){
		models.Node.findAll({include:[
			{model:models.Node,as:'parent'}
		]}).then(function(nodes){
			announced(function(data){
				var g = {nodes:0,clients:0,clients24:0,clients50:0,
					rx_bytes:0,rx_packets:0,tx_bytes:0,tx_packets:0,
					rx24_bytes:0,rx24_packets:0,tx24_bytes:0,tx24_packets:0,
					rx50_bytes:0,rx50_packets:0,tx50_bytes:0,tx50_packets:0,
					mem_total:0};
				for(var i in data){
					if(data[i].node_id){
						g.nodes++;
						g.clients+=data[i].clients.wifi;
						g.clients24+=Math.floor(data[i].clients.wifi24);
						g.clients50+=Math.floor(data[i].clients.wifi50);
						if(data[i].traffic){
							g.rx_bytes+=data[i].traffic.rx.bytes;
							g.rx_packets+=data[i].traffic.rx.packets;
							g.tx_bytes+=data[i].traffic.tx.bytes;
							g.tx_packets+=data[i].traffic.tx.packets;
							if(data[i].traffic.rx24){
								g.rx24_bytes+=data[i].traffic.rx24.bytes;
								g.rx24_packets+=data[i].traffic.rx24.packets;
								g.tx24_bytes+=data[i].traffic.tx24.bytes;
								g.tx24_packets+=data[i].traffic.tx24.packets;
							}
							if(data[i].traffic.rx50){
								g.rx50_bytes+=data[i].traffic.rx50.bytes;
								g.rx50_packets+=data[i].traffic.rx50.packets;
								g.tx50_bytes+=data[i].traffic.tx50.bytes;
								g.tx50_packets+=data[i].traffic.tx50.packets;
							}
						}
						g.mem_total+=data[i].memory.total;
						tmp = {
							mac:data[i].node_id.slice(0, 2)+':'+data[i].node_id.slice(2, 4)+':'+data[i].node_id.slice(4, 6)+':'+data[i].node_id.slice(6, 8)+':'+data[i].node_id.slice(8, 10)+':'+data[i].node_id.slice(10, 12),
							node_id:data[i].node_id,
							values:{
								upstate:1,
								clients:data[i].clients.wifi,
								clients24:Math.floor(data[i].clients.wifi24),
								clients50:Math.floor(data[i].clients.wifi50),
								load:data[i].loadavg,
								uptime:Math.floor(data[i].uptime),


								mem_free:data[i].memory.free,
								mem_usage:data[i].memory.cached,
								mem_total:data[i].memory.total,
								mem_cached:data[i].memory.cached,
								mem_buffers:data[i].memory.buffers
							}
						}
						if(data[i].traffic){
							tmp.values.rx_bytes = data[i].traffic.rx.bytes;
							tmp.values.rx_packets = data[i].traffic.rx.packets;
							tmp.values.tx_bytes = data[i].traffic.tx.bytes;
							tmp.values.tx_packets = data[i].traffic.tx.packets;
							if(data[i].traffic.rx50){
								tmp.values.rx24_bytes = data[i].traffic.rx24.bytes;
								tmp.values.rx24_packets = data[i].traffic.rx24.packets;
								tmp.values.tx24_bytes = data[i].traffic.tx24.bytes;
								tmp.values.tx24_packets = data[i].traffic.tx24.packets;
							}
							if(data[i].traffic.rx24){
								tmp.values.rx50_bytes = data[i].traffic.rx50.bytes;
								tmp.values.rx50_packets = data[i].traffic.rx50.packets;
								tmp.values.tx50_bytes = data[i].traffic.tx50.bytes;
								tmp.values.tx50_packets = data[i].traffic.tx50.packets;
							}
						}
						//console.log(tmp);
						rrd.updateNode(tmp,function(){
							if(nodes){
								var exists = false;
								ports = 0;
								ports_gb = 0;
								if(data[i].switch){
									if(data[i].switch.port1.link=="up"){
										ports++;
										if(data[i].switch.port1.speed.indexOf("1000")>=0)
											ports_gb++;
									}
									if(data[i].switch.port2.link=="up"){
										ports++;
										if(data[i].switch.port2.speed.indexOf("1000")>=0)
											ports_gb++;
									}
									if(data[i].switch.port3.link=="up"){
										ports++;
										if(data[i].switch.port3.speed.indexOf("1000")>=0)
											ports_gb++;
									}
									if(data[i].switch.port4.link=="up"){
										ports++;
										if(data[i].switch.port4.speed.indexOf("1000")>=0)
											ports_gb++;
									}
									if(data[i].switch.port5.link=="up"){
										ports++;
										if(data[i].switch.port5.speed.indexOf("1000")>=0)
											ports_gb++;
									}
								}
								tmp = {
									datetime:(new Date()).toString(),
									status:true,
									client_50:Math.floor(data[i].clients.wifi50),
									client_24:Math.floor(data[i].clients.wifi24),
									ports:ports,
									ports_gb:ports_gb
								};
								if(data[i].traffic){
									tmp.traffic_tx_bytes = data[i].traffic.rx.bytes;
									tmp.traffic_tx_packets = data[i].traffic.rx.packets;
									tmp.traffic_rx_bytes = data[i].traffic.tx.bytes;
									tmp.traffic_rx_packets = data[i].traffic.tx.packets;
									if(data[i].traffic.rx24){
										tmp.traffic_tx24_bytes = data[i].traffic.rx24.bytes;
										tmp.traffic_tx24_packets = data[i].traffic.rx24.packets;
										tmp.traffic_rx24_bytes = data[i].traffic.tx24.bytes;
										tmp.traffic_rx24_packets = data[i].traffic.tx24.packets;
									}
									if(data[i].traffic.rx50){
										tmp.traffic_tx50_bytes = data[i].traffic.rx50.bytes;
										tmp.traffic_tx50_packets = data[i].traffic.rx50.packets;
										tmp.traffic_rx50_bytes = data[i].traffic.tx50.bytes;
										tmp.traffic_rx50_packets = data[i].traffic.tx50.packets;
									}
								}
								for(var j in nodes){
									if(data[i].node_id == nodes[j].mac.split(":").join('')){
										exists = true;
										nodes[j].updateAttributes(tmp).then(function(){
											io.emit('monitormap:node:change',nodes[j]);
										});
										//break;
									}
								}
							}
							if(!exists){
								tmp.channel_24 = config.scanner.channels_24[Math.floor(Math.random() * config.scanner.channels_24.length)];
								tmp.channel_50 = config.scanner.channels_50[Math.floor(Math.random() * config.scanner.channels_50.length)];
								tmp.channel_24_power = config.scanner.default_channel_24_power;
								tmp.channel_50_power = config.scanner.default_channel_50_power;
								tmp.lat = config.scanner.latitude;
								tmp.lon = config.scanner.longitude;
								tmp.mac = data[i].node_id.slice(0, 2)+':'+data[i].node_id.slice(2, 4)+':'+data[i].node_id.slice(4, 6)+':'+data[i].node_id.slice(6, 8)+':'+data[i].node_id.slice(8, 10)+':'+data[i].node_id.slice(10, 12);
								tmp.name = data[i].node_id;

								models.Node.create(tmp,{ignoreDuplicates: true}).then(function(node){
									io.emit('monitormap:node:change',node);
								});
							}
						});
					}
				}
				rrd.updateGlobal(g,function(){
					io.emit('monitormap:global',g);
				});
			});
		});
	}
	intervalObj = setInterval(loop,(config.scanner.timer_announce_between)*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
