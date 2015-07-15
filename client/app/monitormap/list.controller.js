'use strict';

angular.module('monitormapApp')
	.controller('ListMonitormapCtrl',function ($scope,nodes) {
		$scope.sort = {field:'datetime',asc:true}
		$scope.sortC = function(a){
			if(a == $scope.sort.field)
				$scope.sort.asc = !$scope.sort.asc;
			else{
				$scope.sort.field = a;
			}
		}
		$scope.list = [];
		nodes.listRefresh(function(){
			$scope.list = nodes.getArray();
		});
		$scope.getTime = function(b,a){
			//TODO UTC quick Fix
			return (b)-(new Date(a)).getTime();
		}

		$scope.getUpTotal = function(){
	    var total = 0,tmp;
			if($scope.list)
		    for(var i = 0; i < $scope.list.length; i++){
					tmp = $scope.list[i];
					if(tmp.status)
		        total++;
		    }
	    return total;
		}
		$scope.getClients24Total = function(){
	    var total = 0,tmp;
			if($scope.list){
		    for(var i = 0; i < $scope.list.length; i++){
					tmp = $scope.list[i];
					if(typeof tmp.client_24 !== 'undefined')
	        	total +=tmp.client_24;
		    }
			}
	    return total;
		}
		$scope.getClients5Total = function(){
	    var total = 0,tmp;
			if($scope.list){
		    for(var i = 0; i < $scope.list.length; i++){
					tmp = $scope.list[i];
					if(typeof tmp.client_50 !== 'undefined')
	        	total +=tmp.client_50;
		    }
			}
	    return total;
		}
		$scope.$on('factory:nodes:list:change',function(err,r){
			if(!r.old){
				$scope.list.push(r.new);
			}else{
				for(var i in $scope.list){
					if($scope.list[i].id==r.new.id){
						$scope.list[i] = r.new;
						break;
					}
				}
			}
		});
	});
