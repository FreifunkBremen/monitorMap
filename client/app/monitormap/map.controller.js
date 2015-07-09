'use strict';

angular.module('monitormapApp')
	.controller('MapMonitormapCtrl',function ($scope,$location,nodes) {

		$scope.obj={};

		$scope.center = {
			autoDiscover: true
		}
		$scope.tiles={
			url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options:{
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}
			}
		$scope.events= {}
		$scope.paths={};
		var onlineIcon={
			iconUrl:'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4y6WTO2gUURSGvzszO+tusovZNSG45KmJihECggQJYkSbpEgXrG3sxEqwSWNjZW9rH6KNFlpJQAikEIIxUVTyWBI3r52Znd2ZuXOvRZIxosaAB344zfk45/85QmvN/5QFsLg5TaxDljanUHobIVR3FMvRSAXXtZZNttn8DoJXppGdy1glzhTGUVpyofX2HgBAYACx5UeNJ1JxVyrXVroBQF02Rk0j/yhlRK9tM7hjiNSq0vLnBhpFrAPTCavP/dAfC+MyoABjH6+BCqZx6pZU5tvdxtdrObtzNQF4QYUVZ/bBTn1jTKptBPYf741UlTCWPQubb571F27eSAC7wXrbmrtwry5dBOkjLdMEVGrfRvLppcvAnAWw6nwYcYJqu9IWIP7hu0msQsrOp9EEsOEtXwmkAlLHik4IQcUv9yQnxHGmVg92EUIcO3/TsKIEcDJ9dmbd+Y6RuH50SSXpbOmbTwCncwMznyuL805ja8AU5pHDGtDaiouZvhccBJ0xi35/YXjS8RSuz1/l+bDtNCjlBp925C8tJ4Bmu5WL7cPTbdnzD3ccSdVVuB6/yPE0W9WQfKp76mrX+P20kQfAsIRAo4mVpJBte1xMd0/IMPve8cA5NFz3rZVcqjTZ1XJuIptqjmKlsIRAmHvBZ4EOoAmwe4e6SsXBwlB4IuzVQlt2ZJdrX/zZhZdLH4EQ8IE1wD1smdiXcaj/zb/9Jzno+QE3pQpmHj+B3QAAAABJRU5ErkJggg==',
			iconSize:[16,16],
			iconAnchor: [8, 8]
			}
		var offlineIcon = {
			iconUrl:'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIzSURBVHjapJE7TBRhFIXP/Wd2xR2XBWUJLFEEZAtMxEB8VAoxNhArI/Y2dsbKxIbGxsre1toHaowmdkpiYkIUwVezCcuAsht0YZmZnf8x12LXYTUmkHiTL7l/c/5z7iFmxv+MDQDFpzMwUsKdeQhsbUFwdFh4GxPRVnWMjXHs1swbRfZz2pees7Kd6Jm8ANYavRen6gIgAgkBBmz+sXYHXvVqEMqkiSIABOH7E8lk4pbwN19Gbe1XhJ1wjdbbDtgYGCktvbI0o9bLk5uBBhggqttkAPAV9vq186mvC6+qS6fOOLkeFwAEAHilElZePLux4RYny76CAqAIkKjz+12RBuulcp/75P69ynJx20H122pn+cP7a5uSQUI0vvzXEKQBdKEwnvj8aRTAnA0A3+ffjVd+VroUEWjHuxOMMlj7uDARC5QKhZO1qBF6F7USCGXX7YsjmD0tXmAYwqLdlc8My7ZUfMTMwOCsIobk3VHTCq1H8ouxQPbY8Ky9/8BioDUkA+EOSGGZtnz+cSyQ6uj0+8bOTYcRI2SO6/sbBcALAnSPnribOz5SjAWcbAcGz449yg4N3Qy0Rs2YulCDkBlhFMELQ2T6Bx6MXLp8fU8mAwAQNhGYGZHWaO3K3W7vH5iilDPfHEVGDG0nltOHeqe7h45OtaTTKjIGNhHIAghACsBBAA6A5HCuuyfvOKdF4PUTs80tqdVVJd++LrpfGml8ACsAqmQ111tHNO1/lNcgatrxawAzYT+jT/xDvQAAAABJRU5ErkJggg==',
			iconSize:[16,16],
			iconAnchor: [8, 8],
		}
		setTimeout(function(){
			angular.extend($scope,transformMap());
		},100);
		$scope.$on("centerUrlHash", function(event, centerHash) {
			$location.search({ c: centerHash });
		});
		function transformNode(item){
			return {
				lat:item.lat,
				lng:item.lon,
				getMessageScope: function () { $scope.item = item; return $scope; },
				message:'<div ng-include="\'app/monitormap/map_detail.html\'"></div',
				label: {
					message: item.name,
					options: {
							noHide: true
					}
				},
				icon:(item.statistics[item.statistics.length-1].status)?onlineIcon:offlineIcon,
				draggable: true,
				compileMessage: true,
				obj:item
			};
		}
    function transformMap(){
      var output={markers:{},paths:{}};
      nodes.list.forEach(function(item){
				if(item.lat && item.lon && item.statistics[item.statistics.length-1].status){
	        output.markers[item.id] = transformNode(item);
					if(item.parent_id)
						output.paths[item.id]={
							color: (item.statistics[item.statistics.length-1].status && nodes.list[item.parent_id].statistics[item.statistics.length-1].status)?'green':'red',
	            weight: 2,
	            latlngs: [
								{lat:nodes.list[item.id].lat,lng:nodes.list[item.id].lon},
								{lat:nodes.list[item.parent_id].lat,lng:nodes.list[item.parent_id].lon},
							],
							label: {message: "<h3>Link "+item.name+" <-> "+item.parent.name+" </h3>"}
						};
				}
      });
      return output;
    }

		$scope.$on('factory:nodes:list:change',function(event,newValue){
			angular.extend($scope, transformMap());
			console.log($scope);
		});

    $scope.$on('leafletDirectiveMarker.dragend', function(event,args){
			nodes.move(args.model.obj,{lat:args.model.lat,lon:args.model.lng})
			//angular.extend($scope, {markers[args.model.obj.id]:transformNode(nodes.list[args.model.obj.id])});
    });
	});
