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
        var g = {nodes:0,clients:0,clients24:0,clients50:0,rx_bytes:0,rx_packets:0,tx_bytes:0,tx_packets:0,mem_total:0};
	      for(var i in data){
          if(data[i].node_id){
            g.nodes++;
            g.clients+=data[i].clients.wifi;
            g.clients24+=Math.floor(data[i].clients.wifi24);
            g.clients50+=Math.floor(data[i].clients.wifi50);
            g.rx_bytes+=data[i].traffic.rx.bytes;
            g.rx_packets+=data[i].traffic.rx.bytes;
            g.tx_bytes+=data[i].traffic.tx.bytes;
            g.tx_packets+=data[i].traffic.tx.packets;
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
                rx_bytes:data[i].traffic.rx.bytes,
                rx_packets:data[i].traffic.rx.packets,
                tx_bytes:data[i].traffic.tx.bytes,
                tx_packets:data[i].traffic.tx.packets,
                mem_free:data[i].memory.free,
                mem_usage:data[i].memory.cached,
                mem_total:data[i].memory.total,
                mem_cached:data[i].memory.cached,
                mem_buffers:data[i].memory.buffers
              }
            }
            //console.log(tmp);
            rrd.updateNode(tmp,function(){
              if(nodes){
                var exists = false;
                for(var j in nodes){
                  if(data[i].node_id == nodes[j].mac.split(":").join('')){
                    exists = true;
                    nodes[j].updateAttributes({
                      datetime:(new Date()).toString(),
                      status:true,
                      client_50:Math.floor(data[i].clients.wifi50),
                      client_24:Math.floor(data[i].clients.wifi24),
                      traffic_tx_bytes:data[i].traffic.rx.bytes,
                      traffic_tx_packets:data[i].traffic.rx.packets,
                      traffic_rx_bytes:data[i].traffic.tx.bytes,
                      traffic_rx_packets:data[i].traffic.tx.packets,
                    }).then(function(){
                    //models.Node.update(tmp, {where: {id: nodes[j].id}}).then(function(node){
                      io.emit('monitormap:node:change',nodes[j]);
                			console.log(" UP : "+nodes[j].mac);
                    });
                    break;
                  }
                }
                if(!exists){
                  models.Node.create({
                    name:data[i].node_id,
                    mac:data[i].node_id.slice(0, 2)+':'+data[i].node_id.slice(2, 4)+':'+data[i].node_id.slice(4, 6)+':'+data[i].node_id.slice(6, 8)+':'+data[i].node_id.slice(8, 10)+':'+data[i].node_id.slice(10, 12),
                    channel_24:config.scanner.channels_24[Math.floor(Math.random() * config.scanner.channels_24.length)],
                    channel_50:config.scanner.channels_50[Math.floor(Math.random() * config.scanner.channels_50.length)],
                    channel_24_power:config.scanner.default_channel_24_power,
                    channel_50_power:config.scanner.default_channel_50_power,
                    lat:config.scanner.latitude,
                    lon:config.scanner.longitude,
                    datetime:(new Date()).toString(),
                    status:true,
                    client_50:Math.floor(data[i].clients.wifi50),
                    client_24:Math.floor(data[i].clients.wifi24),
                    traffic_tx_bytes:data[i].traffic.rx.bytes,
                    traffic_tx_packets:data[i].traffic.rx.packets,
                    traffic_rx_bytes:data[i].traffic.tx.bytes,
                    traffic_rx_packets:data[i].traffic.tx.packets,
                  },{ignoreDuplicates: true}).then(function(node){
                    io.emit('monitormap:node:change',node);
                    console.log("ADD: "+node.mac);
                  });
                }
              }
            });
          }
        }
        rrd.updateGlobal(g,function(){
          io.emit('monitormap:global',g);
          console.log("[N-Gl]");
        });
	    });
		});
  }
  intervalObj = setInterval(loop,config.scanner.timer_announce*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
