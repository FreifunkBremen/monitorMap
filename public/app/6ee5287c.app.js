"use strict";angular.module("monitormapApp",["ngCookies","ngResource","ngSanitize","ui.router","gettext","btford.socket-io","chart.js","leaflet-directive","relativeDate"]).config(["$urlRouterProvider","$locationProvider",function(a,b){a.otherwise("/"),b.html5Mode(!0).hashPrefix("!")}]).factory("socket",["socketFactory",function(a){return a({prefix:"",ioSocket:io.connect({path:"/ws"})})}]).run(["gettextCatalog","socket",function(a,b){a.currentLanguage="de"}]),angular.module("monitormapApp").controller("DetailMonitormapCtrl",["$scope","$stateParams","nodes",function(a,b,c){a.$on("factory:nodes:list:change",function(d,e){a.obj=c.list[b.id],a.node_id=a.obj.mac.split(":").join("")}),c.detail(b.id,function(){function d(a){var b=void 0;try{var b=new RRDFile(a)}catch(c){}void 0!=b&&(f=b,e())}function e(){var a=new rrdFlot("clientGraph",f,{legend:{noColumns:6},lines:{show:!0},yaxis:{autoscaleMargin:.2},tooltip:!0,tooltipOpts:{content:"<h4>%s</h4> Value: %y.3 - %x"}},{load:{label:"Load",color:"#00ff00"},clients50:{label:"Clients 5.0 Ghz",color:"#0000ff"},clients24:{label:"Clients 2.4 Ghz",color:"#ff0000"},upstate:{label:"Uptime",color:"#ffcccc",yaxis:2,lines:{fill:!0}}},{num_cb_rows:9,use_element_buttons:!0,multi_ds:!1,multi_rra:!0,use_rra:!1,rra:0,use_checked_DSs:!0,checked_DSs:["load","clients50","clients24","upstate"],use_windows:!0,window_min:14364e5,window_max:1437350400,graph_width:"700px",graph_height:"300px",scale_width:"350px",scale_height:"200px",timezone:"+2"});$("#clientGraph_time_sel").val("+2"),a.callback_timezone_changed(),a.scale.clearSelection()}a.obj=c.list[b.id],a.node_id=a.obj.mac.split(":").join("");var f=void 0;try{FetchBinaryURLAsync("/data/"+a.node_id+".rrd",d)}catch(g){}})}]),angular.module("monitormapApp").controller("EditMonitormapCtrl",["$scope","$stateParams","nodes",function(a,b,c){a.channels_24=[1,5,9,13],a.channels_50=[36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140],c.detail(b.id,function(){a.obj=c.list[b.id]}),c.listRefresh(function(){a.nodes_list=c.getArray()}),a.loading=!1,a.save=function(){a.loading=!0,c.save(a.obj,function(b){a.loading=!1})},a.$on("factory:nodes:list:change",function(b,c){if(c.old){for(var d in a.list)if(a.nodes_list[d].id==c["new"].id){a.nodes_list[d]=c["new"];break}}else a.nodes_list.push(c["new"])})}]),angular.module("monitormapApp").controller("GlobalMonitormapCtrl",["$scope","socket",function(a,b){a.g={nodes:0,clients:0,clients24:0,clients50:0,rx_bytes:0,rx_packets:0,tx_bytes:0,tx_packets:0,mem_total:0},b.forward("monitormap:global",a),a.$on("monitormap:global",function(b,c){a.g=c});var c=function(){function a(a){var d=void 0;try{var d=new RRDFile(a)}catch(e){alert("File is not a valid RRD archive!")}void 0!=d&&(c=d,b())}function b(){var a=new rrdFlot("graph",c,{legend:{noColumns:6},lines:{show:!0},yaxis:{autoscaleMargin:.2},tooltip:!0,tooltipOpts:{content:"<h4>%s</h4> Value: %y.3 - %x"}},{nodes:{label:"Nodes",color:"#00ff00"},clients50:{label:"Clients 5.0 Ghz",color:"#0000ff"},clients24:{label:"Clients 2.4 Ghz",color:"#ff0000"},clients:{label:"All Clients",color:"#ffcccc",yaxis:2,lines:{fill:!0}}},{num_cb_rows:9,use_element_buttons:!0,multi_ds:!1,multi_rra:!0,use_rra:!1,rra:0,use_checked_DSs:!0,checked_DSs:["nodes","clients50","clients24","clients"],use_windows:!0,window_min:14364e5,window_max:1437350400,graph_width:"700px",graph_height:"300px",scale_width:"350px",scale_height:"200px",timezone:"+2"});$("#graph_time_sel").val("+2"),a.callback_timezone_changed(),a.scale.clearSelection()}var c=void 0;try{FetchBinaryURLAsync("/data/global.rrd",a)}catch(d){alert("Failed loading rrd\n"+d)}};c()}]),angular.module("monitormapApp").config(["$stateProvider",function(a){a.state("monitormap",{templateUrl:"app/monitormap/index.html"}).state("monitormap.list",{url:"/",templateUrl:"app/monitormap/list.html",controller:"ListMonitormapCtrl"}).state("monitormap.map",{url:"/map?c=:center",templateUrl:"app/monitormap/map.html",controller:"MapMonitormapCtrl"}).state("monitormap.detail",{url:"/detail/:id",templateUrl:"app/monitormap/detail.html",controller:"DetailMonitormapCtrl"}).state("monitormap.global",{url:"/global/:id",templateUrl:"app/monitormap/global.html",controller:"GlobalMonitormapCtrl"}).state("monitormap.edit",{url:"/edit/:id",templateUrl:"app/monitormap/edit.html",controller:"EditMonitormapCtrl"}).state("monitormap.tools",{url:"/tools",templateUrl:"app/monitormap/tools.html"})}]),angular.module("monitormapApp").controller("ListMonitormapCtrl",["$scope","nodes",function(a,b){a.sort={field:"datetime",asc:!0},a.sortC=function(b){b==a.sort.field?a.sort.asc=!a.sort.asc:a.sort.field=b},a.list=[],b.listRefresh(function(){a.list=b.getArray()}),a.getUpTotal=function(){var b,c=0;if(a.list)for(var d=0;d<a.list.length;d++)b=a.list[d],b.status&&c++;return c},a.getClientsTotal=function(){var b,c=0;if(a.list)for(var d=0;d<a.list.length;d++)b=a.list[d],"undefined"!=typeof b.client_50&&(c+=b.client_50),"undefined"!=typeof b.client_24&&(c+=b.client_24);return c},a.$on("factory:nodes:list:change",function(b,c){if(c.old){for(var d in a.list)if(a.list[d].id==c["new"].id){a.list[d]=c["new"];break}}else a.list.push(c["new"])})}]),angular.module("monitormapApp").controller("MapMonitormapCtrl",["$scope","$location","nodes",function(a,b,c){function d(b,c){var d={lat:b.lat,lng:b.lon,getMessageScope:function(){return a.item=b,a},message:"<div ng-include=\"'app/monitormap/map_detail.html'\"></div",label:{message:b.name,options:{noHide:!0}},icon:b.status?g:h,draggable:!0,compileMessage:!0,obj:b};return d}function e(){var a={markers:{},paths:{}};return c.list.forEach(function(b){b.lat&&b.lon&&(a.markers[b.id]=d(b),b.parent_id&&(a.paths[b.id]={color:b.status&&c.list[b.parent_id].status?"green":"red",weight:2,latlngs:[{lat:c.list[b.id].lat,lng:c.list[b.id].lon},{lat:c.list[b.parent_id].lat,lng:c.list[b.parent_id].lon}],label:{message:"<h3>Link "+b.name+" <-> "+b.parent.name+" </h3>"}}))}),a}var f=!1;a.obj={},a.center={autoDiscover:!0},a.tiles={url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",options:{attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}},a.events={},a.paths={};var g={iconUrl:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4y6WTO2gUURSGvzszO+tusovZNSG45KmJihECggQJYkSbpEgXrG3sxEqwSWNjZW9rH6KNFlpJQAikEIIxUVTyWBI3r52Znd2ZuXOvRZIxosaAB344zfk45/85QmvN/5QFsLg5TaxDljanUHobIVR3FMvRSAXXtZZNttn8DoJXppGdy1glzhTGUVpyofX2HgBAYACx5UeNJ1JxVyrXVroBQF02Rk0j/yhlRK9tM7hjiNSq0vLnBhpFrAPTCavP/dAfC+MyoABjH6+BCqZx6pZU5tvdxtdrObtzNQF4QYUVZ/bBTn1jTKptBPYf741UlTCWPQubb571F27eSAC7wXrbmrtwry5dBOkjLdMEVGrfRvLppcvAnAWw6nwYcYJqu9IWIP7hu0msQsrOp9EEsOEtXwmkAlLHik4IQcUv9yQnxHGmVg92EUIcO3/TsKIEcDJ9dmbd+Y6RuH50SSXpbOmbTwCncwMznyuL805ja8AU5pHDGtDaiouZvhccBJ0xi35/YXjS8RSuz1/l+bDtNCjlBp925C8tJ4Bmu5WL7cPTbdnzD3ccSdVVuB6/yPE0W9WQfKp76mrX+P20kQfAsIRAo4mVpJBte1xMd0/IMPve8cA5NFz3rZVcqjTZ1XJuIptqjmKlsIRAmHvBZ4EOoAmwe4e6SsXBwlB4IuzVQlt2ZJdrX/zZhZdLH4EQ8IE1wD1smdiXcaj/zb/9Jzno+QE3pQpmHj+B3QAAAABJRU5ErkJggg==",iconSize:[16,16],iconAnchor:[8,8]},h={iconUrl:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIzSURBVHjapJE7TBRhFIXP/Wd2xR2XBWUJLFEEZAtMxEB8VAoxNhArI/Y2dsbKxIbGxsre1toHaowmdkpiYkIUwVezCcuAsht0YZmZnf8x12LXYTUmkHiTL7l/c/5z7iFmxv+MDQDFpzMwUsKdeQhsbUFwdFh4GxPRVnWMjXHs1swbRfZz2pees7Kd6Jm8ANYavRen6gIgAgkBBmz+sXYHXvVqEMqkiSIABOH7E8lk4pbwN19Gbe1XhJ1wjdbbDtgYGCktvbI0o9bLk5uBBhggqttkAPAV9vq186mvC6+qS6fOOLkeFwAEAHilElZePLux4RYny76CAqAIkKjz+12RBuulcp/75P69ynJx20H122pn+cP7a5uSQUI0vvzXEKQBdKEwnvj8aRTAnA0A3+ffjVd+VroUEWjHuxOMMlj7uDARC5QKhZO1qBF6F7USCGXX7YsjmD0tXmAYwqLdlc8My7ZUfMTMwOCsIobk3VHTCq1H8ouxQPbY8Ky9/8BioDUkA+EOSGGZtnz+cSyQ6uj0+8bOTYcRI2SO6/sbBcALAnSPnribOz5SjAWcbAcGz449yg4N3Qy0Rs2YulCDkBlhFMELQ2T6Bx6MXLp8fU8mAwAQNhGYGZHWaO3K3W7vH5iilDPfHEVGDG0nltOHeqe7h45OtaTTKjIGNhHIAghACsBBAA6A5HCuuyfvOKdF4PUTs80tqdVVJd++LrpfGml8ACsAqmQ111tHNO1/lNcgatrxawAzYT+jT/xDvQAAAABJRU5ErkJggg==",iconSize:[16,16],iconAnchor:[8,8]};a.$on("centerUrlHash",function(a,c){b.search({c:c})}),c.listRefresh(function(){angular.extend(a,e())}),a.$on("factory:nodes:list:change",function(b,c){f||c["new"].id==f.id||(a.markers[c["new"].id]=d(c["new"]))}),a.$on("leafletDirectiveMarker.drag",function(a,b){f=b.model.obj.id}),a.$on("leafletDirectiveMarker.dragend",function(b,d){f=d.model.obj.id,c.move(d.model.obj,{lat:d.model.lat,lon:d.model.lng},function(){c.listRefresh(function(){angular.extend(a,e()),f=!1})})})}]),angular.module("monitormapApp").controller("NavbarCtrl",["$scope","socket",function(a,b){}]),angular.module("monitormapApp").filter("bytes",function(){return function(a,b){if(isNaN(parseFloat(a))||!isFinite(a))return"-";"undefined"==typeof b&&(b=1);var c=["bytes","kB","MB","GB","TB","PB"],d=Math.floor(Math.log(a)/Math.log(1024));return(a/Math.pow(1024,Math.floor(d))).toFixed(b)+" "+c[d]}}),angular.module("monitormapApp").factory("nodes",["socket","$rootScope",function(a,b){var c={list:[]};return a.emit("monitormap:node:list",function(a){a.list.forEach(function(a){c.list[a.id]=a})}),c.listRefresh=function(b){a.emit("monitormap:node:list",function(a){a.list.forEach(function(a){c.list[a.id]=a,b&&b()})})},c.listRefresh(),c.move=function(b,d,e){a.emit("monitormap:node:move",b,d,function(a){c.list[a.node.id]=a.node,e&&e()})},c.detail=function(b,d){a.emit("monitormap:node:detail",{id:b},function(a){c.list[b]=a.node,d&&d()})},c.save=function(b,d){a.emit("monitormap:node:save",b,function(a){c.list[b.id]=a.node,d&&d()})},c.getArray=function(){var a=[];for(var b in c.list)a.push(c.list[b]);return a},a.on("monitormap:node:change",function(a){b.$broadcast("factory:nodes:list:change",{"new":a,old:c.list[a.id]}),c.list[a.id]=a}),c}]),angular.module("gettext").run(["gettextCatalog",function(a){a.setStrings("de",{Home:"Startseite",Login:"Anmelden","Login not possible":"Anmeldung nicht Möglich",Logout:"Abmelden",Mail:"E-Mail",Password:"Passwort",Test:"Test","sign up":"registrieren"})}]),angular.module("monitormapApp").run(["$templateCache",function(a){a.put("app/monitormap/detail.html",'<h1 class="ui header">{{\'Node\'|translate}} {{obj.name}}<div class="sub header">MAC: {{obj.mac}}<a ui-sref=monitormap.map({c:&quot;{{obj.lat}}:{{obj.lon}}:16&quot;})><i class="icon marker"></i></a></div></h1><table class="ui table"><tbody><tr><td colspan=2>Owner</td><td colspan=2>{{obj.owner}}</td></tr><tr ng-if=obj.parent><td colspan=2>Parent</td><td colspan=2><a ui-sref=monitormap.detail({id:obj.parent.id})>{{obj.parent.name}}</a><a ui-sref=monitormap.map({c:&quot;{{obj.parent.lat}}:{{obj.parent.lon}}:18&quot;})><i class="icon marker"></i></a></td></tr><tr><td>Channel 2.4</td><td>{{obj.channel_24}}</td><td>Clients</td><td>{{obj.client_24}}</td></tr><tr><td>Channel 5.0</td><td>{{obj.channel_50}}</td><td>Clients</td><td>{{obj.client_50}}</td></tr></tbody></table><h2>RRD</h2><div id=clientGraph></div>'),a.put("app/monitormap/edit.html",'<h1 class="ui header">{{\'Node\'|translate}} {{obj.name}}<div class="sub header">MAC: {{obj.mac}}<a ui-sref=monitormap.map({c:&quot;{{obj.lat}}:{{obj.lon}}:16&quot;})><i class="icon marker"></i></a></div></h1><form ng-submit=save() class="ui form"><div class=field><label>Name</label><input ng-model="obj.name"></div><div class=field><label>Mac</label><input ng-model="obj.mac"></div><div class=field><label>Owner</label><input ng-model="obj.owner"></div><div class=field><label>Parent</label><select ng-model=obj.parent_id placeholder=Parent ng-options="opt.id as opt.name for opt in nodes_list"></select></div><div class=field><label>Channel 2.4</label><div class="fields two"><select ng-model=obj.channel_24 placeholder=Channel ng-options="opt for opt in channels_24"></select><div class=field><input ng-model=obj.channel_24_power placeholder="Tx Power"></div></div></div><div class=field><label>Channel 5.0</label><div class="fields two"><div class=field><select ng-model=obj.channel_50 placeholder=Channel ng-options="opt for opt in channels_50"></select></div><div class=field><input ng-model=obj.channel_50_power placeholder="Tx Power"></div></div></div><div ng-class="{\'loading\':loading}" ng-click=save() class="ui button">Save</div></form>'),a.put("app/monitormap/global.html",'<h1 class="ui header">{{\'Node\'|translate}}<div class="sub header"><i class="icon sitemap"></i>Global</div></h1><table class="ui table"><tbody><tr><td colspan=3><b>Nodes</b></td><td colspan=3>{{g.nodes}}</td></tr><tr><td><b>Clients</b></td><td>{{g.clients}}</td><td><i>2.4 Ghz</i></td><td>{{g.clients24}}</td><td><i>5 Ghz</i></td><td>{{g.clients50}}</td></tr><tr><td colspan=1><b>TX</b></td><td colspan=2>{{g.tx_bytes|bytes}}</td><td colspan=2><b>RX</b></td><td colspan=1>{{g.rx_bytes|bytes}}</td></tr><tr><td colspan=1><b>TX 2.4 Ghz</b></td><td colspan=2>{{g.tx24_bytes|bytes}}</td><td colspan=2><b>RX 2.4 Ghz</b></td><td colspan=1>{{g.rx24_bytes|bytes}}</td></tr><tr><td colspan=1><b>TX 5 Ghz</b></td><td colspan=2>{{g.tx50_bytes|bytes}}</td><td colspan=2><b>RX 5 Ghz</b></td><td colspan=1>{{g.rx50_bytes|bytes}}</td></tr></tbody></table><h2>RRD</h2><div id=graph></div>'),a.put("app/monitormap/index.html",'<main class="ui page grid main"><div class=row><div ui-view="" class=column></div></div></main>'),a.put("app/monitormap/list.html","<h1 class=\"ui header\">Nodes<div class=\"sub header\"><i class=\"icon list\"></i>List</div></h1><table class=\"ui sortable celled table grey\"><thead><tr><th ng-click=sortC(&quot;name&quot;) ng-class=\"{'sorted':(sort.field=='name'),'ascending':(sort.asc),'descending':(!sort.asc)}\">Name</th><th ng-click=sortC(&quot;mac&quot;) ng-class=\"{'sorted':(sort.field=='mac'),'ascending':(sort.asc),'descending':(!sort.asc)}\">MAC</th><th ng-click=sortC(&quot;status&quot;) ng-class=\"{'sorted':(sort.field=='status'),'ascending':(sort.asc),'descending':(!sort.asc)}\">Status</th><th>Last Seen Time</th><th ng-click=sortC(&quot;datetime&quot;) ng-class=\"{'sorted':(sort.field=='datetime'),'ascending':(sort.asc),'descending':(!sort.asc)}\">Last Seen</th><th ng-click=sortC(&quot;(client_24+client_50)&quot;) ng-class=\"{'sorted':(sort.field=='(client_24+client_50)'),'ascending':(sort.asc),'descending':(!sort.asc)}\">Client ALL</th><th ng-click=sortC(&quot;client_24&quot;) ng-class=\"{'sorted':(sort.field=='client_24'),'ascending':(sort.asc),'descending':(!sort.asc)}\">2.4 Ghz</th><th ng-click=sortC(&quot;client_50&quot;) ng-class=\"{'sorted':(sort.field=='client_50'),'ascending':(sort.asc),'descending':(!sort.asc)}\">5.0 Ghz</th><th>Map</th><th>Edit</th></tr></thead><tbody><tr ng-repeat=\"item in list|orderBy:sort.field:sort.asc\"><td>{{key}}<a ui-sref=monitormap.detail({id:item.id})>{{item.name}}</a></td><td>{{item.mac}}</td><td><i ng-if=item.status class=\"icon large green checkmark circle\"></i><i ng-if=!item.status class=\"icon large red close\"></i></td><td>{{item.datetime|relativeDate:true}}</td><td>{{item.datetime|date:'HH:mm:ss'}}</td><td>{{item.client_50+item.client_24}}</td><td>{{item.client_24}}</td><td>{{item.client_50}}</td><td><a ui-sref=monitormap.map({c:&quot;{{item.lat}}:{{item.lon}}:16&quot;})><i class=\"icon marker\"></i></a></td><td><a ui-sref=monitormap.edit({id:item.id})><i class=\"icon edit\"></i></a></td></tr></tbody><tfoot><tr><th colspan=2>Summe {{ list.length}}</th><th colspan=3>Up {{getUpTotal()}} Down {{ list.length - getUpTotal()}}</th><th colspan=3>Clients {{getClientsTotal()}}</th><th colspan=2></th></tr></tfoot></table>"),a.put("app/monitormap/map.html",'<h1 class="ui header">Nodes<div class="sub header"><i class="icon map"></i>Map</div></h1><div class="ui menu secondary"><a ng-click="center.autoDiscover=true" class="ui item"><i class="icon location arrow"></i>{{\'Where I am\'|translate}}</a></div><leaflet width=100% height=480px center=center paths=paths markers=markers tiles=tiles event-broadcast=events url-hash-center=yes></leaflet>'),a.put("app/monitormap/map_detail.html",'<h1>{{item.name}}<a ui-sref=monitormap.edit({id:item.id})><i class="icon edit"></i></a></h1><p>{{item.mac}}</p><table class="ui table very basic"><thead><tr><th></th><th>2.4 Ghz</th><th>5.0 Ghz</th><th>Sum</th></tr></thead><tbody></tbody><tr><td>Clients</td><td>{{item.client_24}}</td><td>{{item.client_50}}</td><td>{{item.client_24+item.client_50}}</td></tr><tr><td>Channel</td><td>{{item.channel_24}}</td><td>{{item.channel_50}}</td><td></td></tr><tr><td>Power</td><td>{{item.channel_24_power}}</td><td>{{item.channel_50_power}}</td><td></td></tr></table>'),a.put("app/monitormap/tools.html",'<h1 class="ui header">Nodes<div class="sub header"><i class="icon cubes"></i>Tools</div></h1><ul><li><a href=/json/ansible target=_blank>Get Ansible JSON</a></li><li><a href="/json/ansible?callback=a" target=_blank>Get Ansible JSON with callback</a></li></ul>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl id=navbar class="ui top fixed menu"><a class="brand item">MonitorMap</a><a ui-sref=monitormap.list ui-sref-active=active class=item><i class="icon list"></i>{{\'List\'|translate}}</a><a ui-sref=monitormap.map ui-sref-active=active class=item><i class="icon map"></i>{{\'Map\'|translate}}</a><a ui-sref=monitormap.global ui-sref-active=active class=item><i class="icon sitemap"></i>{{\'Global\'|translate}}</a><a ui-sref=monitormap.tools ui-sref-active=active class=item><i class="icon cubes"></i>{{\'Tools\'|translate}}</a></div>')}]);