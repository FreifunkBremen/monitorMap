'use strict';

angular.module('monitormapApp')
	.controller('DetailMonitormapCtrl',function ($scope,$stateParams,nodes) {
		$scope.client = {series:['Channel 5','Channel 25','Sum'],labels:{},data:{},legend:{}}
		$scope.online = {series:['Online'],labels:{},data:{},legend:{}}

		var depNode = function(){
			if(nodes.list.length>0){
				angular.extend($scope, {obj:nodes.list[$stateParams.id]});
				//$scope.obj = nodes.list[$stateParams.id];
				if($scope.obj.statistics){
					$scope.client.labels = [];
					$scope.client.data = [[],[],[]];
					$scope.online.labels = [];
					$scope.online.data = [[]];
					$scope.obj.statistics.forEach(function(item){
						$scope.client.labels.push(item.datetime);
						$scope.client.data[0].push(item.client_5);
						$scope.client.data[1].push(item.client_25);
						$scope.client.data[2].push(item.client_5+item.client_25);

						$scope.online.labels.push(item.datetime);
						$scope.online.data[0].push((item.status)?1:0);
					});
				}
			}
		}
		nodes.detail($stateParams.id);
		depNode();
		$scope.$on('factory:nodes:list:change',function(event,newValue){
			depNode();
		});
	});
