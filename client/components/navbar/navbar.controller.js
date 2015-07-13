'use strict';

angular.module('monitormapApp')
	.controller('NavbarCtrl', function ($scope, $rootScope,socket) {
		$rootScope.passphrase='***';
		$scope.changePassphrase = function(val){
	   $rootScope.passphrase = val;
	 };
	});
