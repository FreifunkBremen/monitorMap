var meshviewer = require('./scanner/meshviewer');
/*
	meshviewer.getNodeinfo();
	meshviewer.getStatistic();
 */
var _getNodes = function(){
	var output = meshviewer.getOrigin('nodes');

	fn(output);
};

var _getGraph = function(){
	var output = meshviewer.getOrigin('graph');
	fn(output);
};

var _getNodelist = function(fn){
	var output = meshviewer.getOrigin('nodelist');
	fn(output);
};

module.exports = {
	getNodes:_getNodes,
	getGraph:_getGraph,
	getNodelist:_getNodelist,
};
