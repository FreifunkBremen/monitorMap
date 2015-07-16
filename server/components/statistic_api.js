var models = require('./models');

module.exports.getJSON = function(fn){
  models.Node.findAll({}).then(function(nodes){
    var output = {
			client24:0,
			client50:0,
			clients:0
    };
    for(var i in nodes){
      var node = nodes[i];
      output.client24+=node.client_24;
			output.client50+=node.client_50;
    }
		output.clients = output.client24+output.client50;
    if(!fn)
      return output;
    fn(output);
  });
}
