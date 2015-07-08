'use strict';

angular.module('monitormapApp')
	.controller('DetailMonitormapCtrl',function ($scope,$stateParams,nodes) {
		$scope.client = {series:['Channel 5.0','Channel 2.4','Sum'],labels:{},data:{},legend:{}}
		$scope.online = {series:['Online'],labels:{},data:{},legend:{}}
		$scope.bytes = {series:['TX','RX','SUM'],labels:{},data:{},legend:{}}
		$scope.packets = {series:['TX','RX','SUM'],labels:{},data:{},legend:{}}

		var depNode = function(){
			if(nodes.list.length>0){
				angular.extend($scope, {obj:nodes.list[$stateParams.id]});
				//$scope.obj = nodes.list[$stateParams.id];
				if($scope.obj.statistics){
					$scope.client.labels = [];
					$scope.client.data = [[],[],[]];
					$scope.online.labels = [];
					$scope.online.data = [[]];
					$scope.bytes.labels = [];
					$scope.bytes.data = [[],[],[]];
					$scope.packets.labels = [];
					$scope.packets.data = [[],[],[]];
					$scope.obj.statistics.forEach(function(item){
						$scope.client.labels.push(item.datetime);
						$scope.client.data[0].push(item.client_50);
						$scope.client.data[1].push(item.client_24);
						$scope.client.data[2].push(item.client_50+item.client_24);

						$scope.online.labels.push(item.datetime);
						$scope.online.data[0].push((item.status)?1:0);

						$scope.bytes.labels.push(item.datetime);
						$scope.bytes.data[0].push(item.traffic_tx_bytes);
						$scope.bytes.data[1].push(item.traffic_rx_bytes);
						$scope.bytes.data[2].push(item.traffic_tx_bytes+item.traffic_rx_bytes);

						$scope.packets.labels.push(item.datetime);
						$scope.packets.data[0].push(item.traffic_tx_packets);
						$scope.packets.data[1].push(item.traffic_rx_packets);
						$scope.packets.data[2].push(item.traffic_tx_packets+item.traffic_rx_packets);
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
