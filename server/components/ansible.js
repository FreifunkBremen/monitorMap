var models = require('./models');
var ipv6calc = require('ipv6calc');
var config = require('../config/environment');
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
      output.nodes.push(nodes[i].name);
      output._meta.hostvars[nodes[i].name] = {
        "ansible_ssh_host":ipv6calc.toIPv6(config.scanner.ipv6_prefix,nodes[i].mac),
        "radio24_channel":nodes[i].channel_24,
        "radio24_txpower":nodes[i].channel_24_power,
        "radio5_channel":nodes[i].channel_50,
        "radio5_txpower":nodes[i].channel_50_power,
        "geo_latitude":nodes[i].lat,
        "geo_longitude":nodes[i].lon
      };
    }
    if(!fn)
      return output;
    fn(output);
  });
}
