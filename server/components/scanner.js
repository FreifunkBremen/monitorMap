var models = require('./models');
var config = require('../config/environment');
var alfred = require('./alfred');
var ipv6calc = require('ipv6calc');
var Ping = require("ping-wrapper");

Ping.configure({
  "command": "ping6",
  "args": ["-n","-c",config.scanner.timer_count,"-i",config.scanner.timer_ping,"-I",config.scanner.ipv6_interface],
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


var _restartPing = function(){
  clearInterval(intervalObjPing);
  models.Node.findAll({include:[
    {model:models.Node_Statistic,as:'statistics'}
  ]}).then(function(nodes){
    //var nodes=[];
    var nodes_laststatistic = [];
    if(nodes.length>0){
      for(var i in nodes){
        if(nodes[i].statistics.length>0){
          nodes_laststatistic[i] = {datetime:0};
          nodes.forEach(function(item){
            if(nodes_laststatistic[i].datetime<item.datetime)
              nodes_laststatistic[i] = item;
          });
        }
      }
    }
    ping.on('ping', function(data){
      var host,exists = false;
      host = ipv6calc.fromIPv6(data.host);
      if(nodes){
        for(var i in nodes){
          if(typeof host.mac !== 'undefined' && nodes[i].mac==host.mac){
            exists = i;
          }
        }
      }
      if(typeof host.mac !== 'undefined' && !exists){
        var tmp = {
          id:parseInt(host.mac.split(":").join('')),
          name:(host.mac.split(":").join('')),
          mac:host.mac,
          lat:config.scanner.latitude,
          lon:config.scanner.longitude,
        };
        var i = nodes.push(tmp);
        nodes_laststatistic.push({});
        exists = i-1;
        nodes_laststatistic[exists] = {
          client_50:0,
          client_24:0,
          datetime:(new Date()).toString(),
          status:true
        };
        var tmp = (nodes[exists].dataValues)?nodes[exists].dataValues:nodes[exists];
        tmp.laststatistic = nodes_laststatistic[exists];
        /*
        if(tmp.laststatistic)
          io.emit('monitormap:node:change',tmp);*/
      }
      if(typeof host.mac !== 'undefined' && exists && !nodes_laststatistic[exists].status){
        nodes_laststatistic[exists].datetime = (new Date()).toString();
        nodes_laststatistic[exists].status = true;
        var tmp = (nodes[exists].dataValues)?nodes[exists].dataValues:nodes[exists];
        tmp.laststatistic = nodes_laststatistic[exists];
        console.log(" UP : "+nodes[exists].mac);
        if(tmp.laststatistic)
          io.emit('monitormap:node:status:change',tmp);
      }
    });
    ping.on('fail', function(data){
        console.log('Fail', data);
    });
    ping.on('exit', function(exit){
      if(exit)
        _restartPing();
    });
    ping.start();

    var ping_repeat = function(){
      if(nodes){
        for(var i in nodes){
          if(((new Date(nodes_laststatistic[i].datetime)).getTime())< ((new Date()).getTime()-(config.scanner.timer_ping*1000+10)*5)){
            nodes_laststatistic[i].status = false;
            nodes_laststatistic[i].datetime = (new Date()).toString();
            var tmp = (nodes[i].dataValues)?nodes[i].dataValues:nodes[i];
            tmp.laststatistic = nodes_laststatistic[i];
            console.log("DOWN: "+nodes[i].mac);
            if(tmp.laststatistic)
              io.emit('monitormap:node:status:change',tmp);
          }
        }
      }
    }

    intervalObjPing = setInterval(ping_repeat,config.scanner.timer_ping*1000);

  });
};
var _restartAlfred = function(){
  clearInterval(intervalObjAlfred);
  /**
   * Alfred change statistics
   * TODO: Add create to models
   */

  var alfred_repeat = function(){
    models.Node.findAll({include:[
      {model:models.Node_Statistic,as:'statistics'}
    ]}).then(function(nodes){
      //var nodes=[];
      var nodes_laststatistic = [];
      if(nodes.length>0){
        for(var i in nodes){
          if(nodes[i].statistics.length>0){
            nodes_laststatistic[i] = {datetime:0};
            nodes.forEach(function(item){
              if(nodes_laststatistic[i].datetime<item.datetime)
                nodes_laststatistic[i] = item;
            });
          }
        }
      }
      alfred.getJSON(function(data){
        for(var i in data){
          // ONLY Nodes with Clients
          if(data[i].clients && typeof data[i].clients.wifi !== 'undefined'){
            if(nodes){
              for(var j in nodes){
                if(data[i].node_id == nodes[j].mac.split(":").join('')){
                  nodes_laststatistic[j] ={
                    datetime:(new Date()).toString(),
                    status:true,
                    client_50:0,
                    client_24:data[i].clients.wifi||0,
                    traffic_tx_bytes:data[i].traffic.tx.bytes||0,
                    traffic_tx_packets:data[i].traffic.tx.packets||0,
                    traffic_rx_bytes:data[i].traffic.rx.bytes||0,
                    traffic_rx_packets:data[i].traffic.rx.packets||0,
                  }
                  if(!nodes[j].statistics)
                    nodes[j].statistics=[];
                  nodes[j].statistics.push(nodes_laststatistic[j]);
                  var tmp = (nodes[j].dataValues)?nodes[j].dataValues:nodes[j];
                  tmp.laststatistic = nodes_laststatistic[j];
                  console.log("A-UP: "+nodes[j].mac);
                  if(tmp.laststatistic)
                    io.emit('monitormap:node:status:change',tmp);
                }
              }
            }
          }
        }
      });
    });
  }
  intervalObjAlfred = setInterval(alfred_repeat,config.scanner.timer_alfred*1000);
};


module.exports = function(ioInit){
  io = ioInit;
  _restartPing();
  _restartAlfred();
  return;
}
