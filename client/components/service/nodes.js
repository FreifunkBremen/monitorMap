'use strict';

angular.module('monitormapApp')
	.factory('nodes', ['socket','$rootScope',function(socket,$rootScope){
  var o = {
    list: []
  };
  socket.emit('monitormap:node:list',function(result) {
		result.list.forEach(function(n){
			o.list[n.id] =n;
		});
  });
  o.move = function(obj,loc){
    socket.emit('monitormap:node:move',obj,loc,function(result) {
      o.list[result.node.id] = result.node;
    });
  }
  o.detail = function(id,fn){
		socket.emit('monitormap:node:detail',{id:id},function(result) {
      o.list[id] = result.node;
			if(!fn)
				fn();
		});
  }
	o.save = function(ob,fn){
		socket.emit('monitormap:node:save',obj,function(result) {
      o.list[obj.id] = result.node;
			if(!fn)
				fn();
		});
  }
	socket.on('monitormap:node:change', function (obj) {
		o.list[obj.id] = obj;
  });
	socket.on('monitormap:node:status:change', function (obj) {
		console.log(obj);
		o.list[obj.id] = obj;
		/*
		console.log(obj.statistics[item.statistics.length-1]);
		if(obj.statistics[item.statistics.length-1] && o.list[obj.id]){
			o.list[obj.id].statistics[item.statistics.length-1] = obj.statistics[item.statistics.length-1];
		}else{
			console.log('ERROR fetch status: '+obj.name);
		}*/
  });
	$rootScope.$watch(function () {
        return o.list;
    }, function (newValue, oldValue, scope) {
			$rootScope.$broadcast('factory:nodes:list:change', newValue);
    }, true);
  return o;
}]);
