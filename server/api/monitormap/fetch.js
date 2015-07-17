var models = require('../../components/models');
var config = require('../../config/environment');


module.exports = function(data,res,next,io) {
	/*
	if(data.passphrase == config.passphrase){
		var mac = data.mac.slice(0, 2)+':'+data.mac.slice(2, 4)+':'+data.mac.slice(4, 6)+':'+data.mac.slice(6, 8)+':'+data.mac.slice(8, 10)+':'+data.mac.slice(10, 12);
		console.log(mac);
		models.Node.findOne({where:{mac:mac}}).then(function(cur_node){
			//var cur_node = node[0];
			console.log('in Node');
			var tmp = {
				channel_24:data.radio24_channel,
				channel_50:data.radio5_channel,
				channel_24_power:data.radio24_txpower,
				channel_50_power:data.radio5_txpower,
			};
			if(cur_node){
				cur_node.updateAttributes(tmp).then(function(b){
					res.status(200).send('ok').end();
					console.log('a');
				});
			}else{
				res.status(403).send('failed').end();
			}
		});
		console.log('end');
	}else{
		res.status(403).send('failed').end();
	}
	*/
};
