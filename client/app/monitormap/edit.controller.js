'use strict';

angular.module('monitormapApp')
	.controller('EditMonitormapCtrl',function ($scope,$stateParams,nodes,$timeout) {
    $scope.loading = false;
		$scope.save = function(){
			console.log("save");
			$scope.loading = true;
			nodes.save($scope.obj,function(r){
				$scope.loading = false;
			});
		}
		$scope.obj = nodes.list[$stateParams.id];
    /*
		$scope.$on('factory:nodes:list:change',function(event,newValue){
			depNode();
			(10:51:31 PM) corny: 36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140
			(10:51:35 PM) corny: für 5 ghz
			(10:51:44 PM) corny: und 1,5,9,13 für 2.4 ghz
		});*/
  });
