'use strict';

angular.module('monitormapApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'gettext',
	'btford.socket-io',
	'chart.js',
	'leaflet-directive',
	'relativeDate'
])
	.config(['$urlRouterProvider','$locationProvider',function ($urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode(true).hashPrefix('!');
}])
	.factory('socket', function (socketFactory) {
		return socketFactory({
			prefix: '',
			ioSocket: io.connect({path:'/ws'})
		});
	})
	.run(function(gettextCatalog,socket,$rootScope,$interval){
		gettextCatalog.currentLanguage = 'de';
		//gettextCatalog.debug = true;
		$interval(function () {
			$rootScope.currentTime = new Date().getTime();
		}, 1000);
	})
