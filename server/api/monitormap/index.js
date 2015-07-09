var models = require('../../components/models');
var _getId = function(id,fn){
	models.Node.findAll({where:id,
		include:[
			{model:models.Node_Statistic,as:'statistics'},
			{model:models.Node,as:'parent'}
		],
	}).then(function(node){
			fn(node[0]);
	});
}
var _detail = function(id,fn){
	_getId(id,function(a){
		if(a){
			fn({s:true,node:a});
		}else{
			fn({s:false});
		}
	});
}
var _list = function(fn){
	models.Node.findAll({
		include:[
			{model:models.Node_Statistic,as:'statistics'},
			{model:models.Node,as:'parent'}
		],
	}).then(function(node){

		if(node.length>0){
			for(var i in node){
				if(node[i].statistics.length>0){
					node[i].laststatistic = {datetime:0};
					node[i].statistics.forEach(function(item){
						if(node[i].laststatistic.datetime<item.datetime)
							node[i].laststatistic = item;
					});
					node[i].dataValues.laststatistic = node[i].laststatistic;
				}
			}
			fn({s:true,list:node});
		}
	});
}

module.exports = function(socket) {

	socket.on('monitormap:node:detail',_detail);


	socket.on('monitormap:node:list',_list);


	socket.on('monitormap:node:move',function(obj,loc,fn){
		models.Node.update({lat: loc.lat,lon:loc.lon}, {where: {id: obj.id}}).then(function(node){
			if(node){
				_getId(obj.id,function(dbnode){
					socket.broadcast.emit('monitormap:node:change',dbnode);
					fn({s:true,node:dbnode});
				});
			}else{
				fn({s:false,node:obj})
			}
		});
	});


	socket.on('monitormap:node:save',function(obj,fn){
		models.Node.update({
			name:obj.name,
			owner:obj.owner,
			mac:obj.mac,
			parent_id:obj.parent_id,
			lat:obj.lat,
			lon:obj.lon,
			channel_24:obj.channel_24,
			channel_50:obj.channel_50,
			channel_24_power:obj.channel_24_power,
			channel_50_power:obj.channel_50_power
		}, {where: {id: obj.id}}).then(function(node){
			if(node){
				_getId(obj.id,function(dbnode){
					socket.broadcast.emit('monitormap:node:change',dbnode);
					fn({s:true,node:dbnode});
				});
			}else{
				fn({s:false,node:node});
			}
		});
	});


	socket.on('monitormap:node:add',function(obj,fn){
		models.Node.create({
			name:obj.name,
			owner:obj.owner,
			mac:obj.mac,
			parent_id:obj.parent_id,
			lat:obj.lat,
			lon:obj.lon,
			channel_24:obj.channel_24,
			channel_50:obj.channel_50
		}).then(function(node){
			if(node){
				_getId(node,function(dbnode){
					socket.broadcast.emit('monitormap:node:change',dbnode);
					fn({s:true,node:dbnode});
				});
			}else{
				fn({s:false,node:node});
			}
		});
	});



};
