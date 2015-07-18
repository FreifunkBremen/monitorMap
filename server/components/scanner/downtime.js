var models = require('../models');
var config = require('../../config/environment');
var ipv6calc = require('ipv6calc');
var Ping = require("../ping");

var intervalObj,io;


function hex2dec(val){
  return parseInt("0x"+val);
}

function dec2hex(val){
  var str="";
  var minus=false;
  if(val<0){minus=true;val*=-1;}
  val=Math.floor(val);
  while(val>0){
    var v=val%16;
    val/=16;val=Math.floor(val);
    switch(v){
      case 10:v="a";break;
      case 11:v="b";break;
      case 12:v="c";break;
      case 13:v="d";break;
      case 14:v="e";break;
      case 15:v="f";break;
    }
    str=v + str;
  }
  if(str=="")str="0";
  if(minus)str="-"+str;
  return str;
}

function dec2hexlen(val,minlen){
  var str=dec2hex(val);
  while(str.length<minlen)str="0"+str;
  return str;
}


function correctIp(mac){
  var mac=mac.replace(/:/g,"-").split("-");
  mac[5] = dec2hex(hex2dec(mac[5])-2);
  return mac.join(':');
}


var regex = /\s(\d+)%\spacket\sloss/g ;
Ping.configure({
  "command": "ping6",
  "args": ["-n","-i",config.scanner.timer_ping,"-I",config.scanner.ipv6_interface,'-c',config.scanner.timer_ping_count],
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

var _init = function(){
  clearInterval(intervalObj);

  var loop = function(){
		models.Node.findAll({include:[
			{model:models.Node,as:'parent'}
		]}).then(function(nodes){
  		for(var j in nodes){
        var ping = new Ping(ipv6calc.toIPv6(config.scanner.ipv6_prefix,correctIp(nodes[j].mac)),nodes[j]);
        ping.on('exit', function(exit,that){
          var tmp = regex.exec(that.data);
          if(tmp!==null){
            var lost = parseInt(tmp[1])
            if(lost < config.scanner.timer_ping_offline){
              that.node.updateAttributes({
                status:true,
                datetime:(new Date().getTime()),
              }).then(function(){
                io.emit('monitormap:node:change',that.node);
              });
            }else{
              that.node.updateAttributes({
                status:false
              }).then(function(){
                io.emit('monitormap:node:change',that.node);
              });
            }
          }
        });
      }
    });
  }
  intervalObj = setInterval(loop,config.scanner.timer_ping_between*1000);
};

module.exports = function(ioInit){
	io = ioInit;
	_init();
};
