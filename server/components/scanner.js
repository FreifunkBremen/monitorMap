var models = require('./models');
var config = require('../config/environment');
var alfred = require('./alfred');
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
  copyNode.statistics.push(statistics);
  return copyNode;
}

var _restartPing = function(){
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
      //console.log(" UP : "+tmp.mac);
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

  var ping_repeat = function(){
    if(nodes){
      for(var i in nodes){
        var cur = nodes[i].statistics[nodes[i].statistics.length-1];

        if(((new Date(cur.datetime)).getTime())< ((new Date()).getTime()-(config.scanner.timer_ping*1000+10)*10)){
          var tmp = pushFakeStatic(nodes[i],{
            client_50:0,
            client_24:0,
            datetime:(new Date()).toString(),
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

  intervalObjPing = setInterval(ping_repeat,config.scanner.timer_ping*1000);
};
var _restartAlfred = function(){
  clearInterval(intervalObjAlfred);
  updateDBCache();
  /**
   * Alfred change statistics
   * TODO: Add create to models
   */

  var alfred_repeat = function(){
    alfred.getJSON(function(data){
      for(var i in data){
        // ONLY Nodes with Clients
        if(data[i].clients && typeof data[i].clients.wifi !== 'undefined'){
          if(nodes){
            for(var j in nodes){
              if(data[i].node_id == nodes[j].mac.split(":").join('')){
                /*
                {
                  node_id:nodes[j].id,
                  datetime:(new Date()).toString(),
                  status:true,
                  client_50:0,
                  client_24:data[i].clients.wifi||0,
                  traffic_tx_bytes:data[i].traffic.tx.bytes||0,
                  traffic_tx_packets:data[i].traffic.tx.packets||0,
                  traffic_rx_bytes:data[i].traffic.rx.bytes||0,
                  traffic_rx_packets:data[i].traffic.rx.packets||0,
                }
                */
                console.log("A-UP: "+nodes[j].mac);
                /*
                if(tmp.laststatistic)
                  io.emit('monitormap:node:status:change',tmp);
                */
              }
            }
          }
        }
      }
    });
  }
  intervalObjAlfred = setInterval(alfred_repeat,config.scanner.timer_alfred*1000);
};


module.exports = function(ioInit){
  io = ioInit;
  _restartPing();
  //_restartAlfred();
  return;
}
