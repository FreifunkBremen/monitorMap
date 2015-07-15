'use strict';

angular.module('monitormapApp')
	.controller('EditMonitormapCtrl',function ($scope,$stateParams,nodes) {
		$scope.channels_24 = [1,5,9,13];
		$scope.channels_50 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140];

		$scope.center = {
			autoDiscover: false
		}

		nodes.detail($stateParams.id,function(){
			$scope.obj = nodes.list[$stateParams.id];
			$scope.center.lat = $scope.obj.lat;
			$scope.center.lng = $scope.obj.lon;
			$scope.center.zoom = 18;
			console.log($scope.center);
		});
		nodes.listRefresh(function(){
			$scope.nodes_list = nodes.getArray();
		});

    $scope.loading = false;
		$scope.save = function(){
			$scope.loading = true;
			$scope.obj.lat = $scope.center.lat;
			$scope.obj.lon = $scope.center.lng;
			nodes.save($scope.obj,function(r){
				$scope.obj = nodes.list[$stateParams.id];
				$scope.loading = false;
			});
		}
		$scope.$on('factory:nodes:list:change',function(err,r){
			if(!r.old){
				$scope.nodes_list.push(r.new);
			}else{
				for(var i in $scope.list){
					if($scope.nodes_list[i].id==r.new.id){
						$scope.nodes_list[i] = r.new;
						break;
					}
				}
			}
		});
		$scope.tiles={
			url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options:{
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}
			}
  });
