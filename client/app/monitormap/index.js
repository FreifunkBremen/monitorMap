'use strict';

angular.module('monitormapApp')
.config(['$stateProvider',function ($stateProvider) {
	$stateProvider
		.state('monitormap', {
			templateUrl: 'app/monitormap/index.html'
		})
		.state('monitormap.list', {
			url:'/',
			templateUrl: 'app/monitormap/list.html',
			controller: 'ListMonitormapCtrl'
		})
		.state('monitormap.map', {
			url:'/map?c=:center',
			templateUrl: 'app/monitormap/map.html',
			controller: 'MapMonitormapCtrl'
		})
		.state('monitormap.detail', {
			url:'/detail/:id',
			templateUrl: 'app/monitormap/detail.html',
			controller: 'DetailMonitormapCtrl'
		});
}]);
