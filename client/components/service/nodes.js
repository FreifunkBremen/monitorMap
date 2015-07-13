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
	o.listRefresh = function(fn){
		socket.emit('monitormap:node:list',function(result) {
			result.list.forEach(function(n){
				o.list[n.id] =n;
				if(fn)
					fn();
			});
	  });
	}
	o.listRefresh();
  o.move = function(obj,loc,fn){
    socket.emit('monitormap:node:move',obj,loc,$rootScope.passphrase,function(result) {
			if(result.s){
      	o.list[result.node.id] = result.node;
			}
			if(fn)
				fn();
    });
  }
  o.detail = function(id,fn){
		socket.emit('monitormap:node:detail',{id:id},function(result) {
      o.list[id] = result.node;
			if(fn)
				fn(result);
		});
  }
	o.save = function(obj,fn){
		socket.emit('monitormap:node:save',obj,$rootScope.passphrase,function(result) {
			if(result.s){
	      o.list[obj.id] = result.node;
			}
			if(fn)
				fn();
		});
  }

	o.getArray = function(){
			var a =[];
			for(var i in o.list)
				a.push(o.list[i]);
			return a;
		}
	socket.on('monitormap:node:change', function (obj) {
		$rootScope.$broadcast('factory:nodes:list:change', {
			new:obj,
			old:o.list[obj.id]
			});
		o.list[obj.id] = obj;
  });
  return o;
}]);
