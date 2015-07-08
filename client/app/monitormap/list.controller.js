'use strict';

angular.module('monitormapApp')
	.controller('ListMonitormapCtrl',function ($scope,nodes) {
		$scope.list = [];
		var depNode = function(){
			$scope.list = [];
			nodes.list.forEach(function(node){
				$scope.list.push(node);
			});
		}
		depNode();
		$scope.$on('factory:nodes:list:change',function(event,newValue){
			depNode();
		});
		$scope.getUpTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.list.length; i++){
				if($scope.list[i].laststatistic.status)
	        total++;
	    }
	    return total;
		}
		$scope.getClientsTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.list.length; i++){
        total += $scope.list[i].laststatistic.client_5+$scope.list[i].laststatistic.client_25;
	    }
	    return total;
		}
	});
