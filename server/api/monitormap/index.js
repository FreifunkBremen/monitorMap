var models = require('../../components/models');
var _getId = function(id,fn){
	models.Node.findAll({where:id,
		include:[
			{model:models.Node,as:'parent'}
		],
	}).then(function(node){
			var tmpNode = node[0].dataValues;
			fn(tmpNode);
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
			{model:models.Node,as:'parent'}
		],
	}).then(function(node){
		if(node.length>0){
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
			mon:obj.mon,
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
