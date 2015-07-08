'use strict';

angular.module('monitormapApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'gettext',
	'btford.socket-io',
	'chart.js',
	'leaflet-directive'
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
	.run(function(gettextCatalog,socket){
		gettextCatalog.currentLanguage = 'de';
		gettextCatalog.debug = true;
	})
