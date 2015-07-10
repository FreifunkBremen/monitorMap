'use strict';

angular.module('monitormapApp')
	.controller('ListMonitormapCtrl',function ($scope,nodes) {
		$scope.list = nodes.list;

		$scope.getUpTotal = function(){
	    var total = 0,tmp;
	    for(var i = 0; i < $scope.get($scope.list).length; i++){
				tmp = $scope.get($scope.list)[i];
				if(tmp.status)
	        total++;
	    }
	    return total;
		}
		$scope.getClientsTotal = function(){
	    var total = 0,tmp;
	    for(var i = 0; i < $scope.get($scope.list).length; i++){
				tmp = $scope.get($scope.list)[i];
				if(typeof tmp.client_50 !== 'undefined')
        	total +=tmp.client_50;
				if(typeof tmp.client_24 !== 'undefined')
        	total +=tmp.client_24;
	    }
	    return total;
		}
		$scope.get = function(a){
			var o =[];
			for(var i in a)
				o.push(a[i]);
			return o;
		}
	});
