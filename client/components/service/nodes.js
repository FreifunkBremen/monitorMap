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
  o.detail = function(id){
		socket.emit('monitormap:node:detail',{id:id},function(result) {
			console.log(result);
      o.list[id] = result.node;
		});
  }
	socket.on('monitormap:node:change', function (obj) {
		o.list[obj.id] = obj;
  });
	$rootScope.$watch(function () {
        return o.list;
    }, function (newValue, oldValue, scope) {
			$rootScope.$broadcast('factory:nodes:list:change', newValue);
    }, true);
  return o;
}]);
