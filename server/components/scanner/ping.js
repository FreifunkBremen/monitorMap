var models = require('../models');
var config = require('../../config/environment');
var ipv6calc = require('ipv6calc');
var Ping = require("ping-wrapper");

Ping.configure({
  "command": "ping6",
  "args": ["-n","-i",config.scanner.timer_ping,"-I",config.scanner.ipv6_interface],
  "events": {
    "ping": {
      "regexp": {
        "string": "^([0-9]+) bytes from ([0-9a-f\\:]+): icmp_seq=([0-9]+) ttl=([0-9]+) time=([0-9.]+) ms.*",
        "bytes": 1,
        "host": 2,
        "icmp_req": 3,
        "ttl": 4,
        "time": 5
      }
    },
    "unreachable": {
      "emits": ["fail"],
      "regexp": {
        "string": "^From ([0-9.]+) icmp_seq=([0-9]+) Destination Host Unreachable",
        "host": 1,
        "icmp_seq": 2
      }
    }
  }
});

var io;
var ping = new Ping(config.scanner.ipv6_pingall);
var intervalObjPing,intervalObjAlfred;

var nodes;

var updateDBCache = function(){
  models.Node.findAll({include:[
    {model:models.Node_Statistic,as:'statistics'}
  ]}).then(function(nodesList){
    nodes = nodesList;
  });
};

var pushFakeStatic = function(node,statistics){
  var copyNode = {
    id:node.id,
    name:node.name,
    owner:node.owner,
    parent_id:node.parent_id,
    mac:node.mac,
    lat:node.lat,
    lon:node.lon,
    channel_24:node.channel_24,
    channel_50:node.channel_50,
    channel_24_power:node.channel_24_power,
    channel_50_power:node.channel_50_power,
    statistics:[]
  };
  for(var i in node.statistics){
    copyNode.statistics.push({
      datetime:node.statistics[i].datetime,
      status:node.statistics[i].status,
      client_24:node.statistics[i].client_24,
      client_50:node.statistics[i].client_50,
      traffic_tx_bytes:node.statistics[i].traffic_tx_bytes,
      traffic_tx_packets:node.statistics[i].traffic_tx_packets,
      traffic_rx_bytes:node.statistics[i].traffic_rx_bytes,
      traffic_rx_packets:node.statistics[i].traffic_rx_packets,
      });
  }
	if(node.statistics.length>10)
		copyNode.statistics = node.statistics.slice(node.statistics.length-10);
  copyNode.statistics.push(statistics);
  return copyNode;
}

var _init = function(){
  clearInterval(intervalObjPing);
  updateDBCache();
  ping.on('ping', function(data){
    var host,exists = false;
    host = ipv6calc.fromIPv6(data.host);
    if(nodes){
      for(var i in nodes){
        if(typeof host.mac !== 'undefined' && nodes[i].mac==host.mac){
          exists = i;
          break;
        }
      }
    }
    if(typeof host.mac !== 'undefined' && !exists){
      models.Node.create({
        name:(host.mac.split(":").join('')),
        mac:host.mac,
        channel_24:config.scanner.default_channel_24,
        channel_50:config.scanner.default_channel_50,
        channel_24_power:config.scanner.default_channel_24_power,
        channel_50_power:config.scanner.default_channel_50_power,
        lat:config.scanner.latitude,
        lon:config.scanner.longitude,
        statistics:{
          client_50:0,
          client_24:0,
          datetime:(new Date()).toString(),
          status:true,
          traffic_tx_bytes:0,
          traffic_tx_packets:0,
          traffic_rx_bytes:0,
          traffic_rx_packets:0
        }
      },{
        include:[{model:models.Node_Statistic,as:'statistics'}],
        ignoreDuplicates: true
      }).then(function(node){
        nodes.push(node);
        io.emit('monitormap:node:change',node);
        updateDBCache();
        console.log("ADD : "+node.mac);
      });
    }
    // Just Toggle Notification only without fakePush possible
    if(typeof host.mac !== 'undefined' && exists){
      var tmp = pushFakeStatic(nodes[exists],{
        client_50:0,
        client_24:0,
        datetime:(new Date()).toString(),
        status:true,
        traffic_tx_bytes:0,
        traffic_tx_packets:0,
        traffic_rx_bytes:0,
        traffic_rx_packets:0
      });
      console.log(" UP : "+tmp.mac);
      io.emit('monitormap:node:status:change',  tmp);

    }
  });
  ping.on('fail', function(data){
      console.log('Fail', data);
  });
  ping.on('exit', function(exit){
    console.log('PING ERROR');
  });
  ping.start();

  var loop = function(){
    models.Node.findAll({include:[
      {model:models.Node_Statistic,as:'statistics'}
    ]}).then(function(nodesList){
      if(nodesList){
				nodes = nodesList;
        for(var i in nodesList){
          if(nodesList[i].statistics.length >0){
            var cur = nodesList[i].statistics[nodesList[i].statistics.length-1];
            var node_seen = (new Date(cur.datetime)).getTime();
            var cur_time = (new Date()).getTime();
            node_seen = node_seen+(config.scanner.timer_ping*1000+10);

            if(node_seen <= cur_time){
              var tmp = pushFakeStatic(nodes[i],{
                client_50:0,
                client_24:0,
                datetime:cur_time,
                status:false,
                traffic_tx_bytes:0,
                traffic_tx_packets:0,
                traffic_rx_bytes:0,
                traffic_rx_packets:0
              });
              console.log("DOWN: "+tmp.mac);
              io.emit('monitormap:node:status:change',tmp);
            }
          }
        }
      }
    });
  }

  intervalObjPing = setInterval(loop,config.scanner.timer_ping*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
