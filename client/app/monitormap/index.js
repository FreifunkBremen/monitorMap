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
		})
		.state('monitormap.global', {
			url:'/global/:id',
			templateUrl: 'app/monitormap/global.html',
			controller: 'GlobalMonitormapCtrl'
		})
		.state('monitormap.edit', {
			url:'/edit/:id',
			templateUrl: 'app/monitormap/edit.html',
			controller: 'EditMonitormapCtrl'
		})
		.state('monitormap.tools', {
			url:'/tools',
			templateUrl: 'app/monitormap/tools.html'
		});
}]);
