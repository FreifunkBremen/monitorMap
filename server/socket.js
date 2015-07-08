var monitormap = require('./api/monitormap');

module.exports = function(socket) {
	monitormap(socket);
};
