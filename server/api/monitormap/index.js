var models = require('../../components/models');
var ipv6calc = require('ipv6calc');





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
			fn({s:true,node:a,ipv6:ipv6calc.toIPv6(config.scanner.ipv6_prefix,a.mac)});
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
