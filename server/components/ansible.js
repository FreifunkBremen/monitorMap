var models = require('./models');
var ipv6calc = require('ipv6calc');
var config = require('../config/environment');


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



module.exports.getJSON = function(fn){
  models.Node.findAll({}).then(function(nodes){
    var output = {
      "nodes":[],
      "_meta":{
        "hostvars" : {

        }
      }
    };
    for(var i in nodes){
      var node = nodes[i]
      if(node.status){
        var name = node.mac.replace(/[:-]/g,"");
        var mac  = node.mac.replace(/:/g,"-").split("-");
        if(node.name.indexOf("CPE")==-1)
          mac[5] = dec2hex(hex2dec(mac[5])-2);

        output.nodes.push(name);

        output._meta.hostvars[name] = {
          "ansible_ssh_host": ipv6calc.toIPv6(config.scanner.ipv6_prefix, mac.join(':')),
          "node_name":        node.name,
          "radio24_channel":  node.channel_24,
          "radio24_txpower":  node.channel_24_power,
          "radio5_channel":   node.channel_50,
          "radio5_txpower":   node.channel_50_power,
          "geo_latitude":     node.lat,
          "geo_longitude":    node.lon
        };
      }
    }
    if(!fn)
      return output;
    fn(output);
  });
}
