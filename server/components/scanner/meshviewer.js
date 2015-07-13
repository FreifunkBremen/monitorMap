var request =function(a,b){};

var config = require('../../config/environment');
var announced = require('./announced');

var intervalObj;

var nodeinfos,statistics,origin=[
	{key:'graph',file:'graph.json',values:{}},
	{key:'nodelist',file:'nodelist.json',values:{}},
	{key:'nodes',file:'nodes.json',values:{}}
	];
var _init = function(){
  clearInterval(intervalObj);

  var loop = function(){
		for(var i in origin){
			request({
    		url: config.scanner.meshviewer+origin[i].file,
    		json: true
			}, function (error, response, body) {
			    if (!error && response.statusCode === 200) {
						origin[i].values = body;
			    }
			})
			announced(function(data){
				nodeinfos=data;
			},'nodeinfo');
			announced(function(data){
				statistics=data;
			});
		}

		intervalObj = setInterval(loop,config.scanner.timer_meshviewer*1000);
	};
}
  //alfred(io);
  //ping(io);
	module.exports = {
		init:_init,
		getNodeinfo:function(){return nodeinfos},
		getStatistic:function(){return nodeinfos},
		getOrigin:function(key){
				for(var i in origin){
					if(origin[i].key == key)
						return origin[i].values;
				}
				return null;
			},
	}
