var models = require('./models');
var ipv6calc = require('ipv6calc');
var config = require('../config/environment');
module.exports.getJSON = function(fn){
  models.Node.findAll({}).then(function(nodes){
    var output = [];
    for(var i in nodes){
      output.push({
        name:nodes[i].name,
        ipv6:ipv6calc.toIPv6(config.scanner.ipv6_prefix,nodes[i].mac),
        latitude:nodes[i].lat,
        longitude:nodes[i].lon,
        channel_24:nodes[i].channel_24,
        channel_50:nodes[i].channel_50,
      });
    }
    if(!fn)
      return output;
    fn(output);
  });
}
