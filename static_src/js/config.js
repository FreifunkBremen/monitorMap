angular.module('config', [])
	.factory('config',function(){
		return {
			"HOST":"http://localhost:8080",
			"RRD":"file:///tmp/data",
			"offline_time":5*60*1000
			}
	})