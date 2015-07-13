/*
 * Just no Lose
 */
 var models = require('../models');
var alfred = require('../alfred');

var io,intervalObj;

var _init = function(){
  clearInterval(intervalObj);
  //updateDBCache();
  /**
   * Alfred change statistics
   * TODO: Add create to models
   */

  var loop = function(){
		models.Node.findAll({include:[
	    {model:models.Node_Statistic,as:'statistics'}
	  ]}).then(function(nodes){
	    alfred(function(data){
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
	  });
  };
  intervalObj = setInterval(lopp,config.scanner.timer_alfred*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
