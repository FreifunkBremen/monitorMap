/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server,{path:'/ws'});

require('./config/express')(app);

var socketRoute = require('./socket');
io.sockets.on('connection',socketRoute);

require('./routes')(app,io);
require('./components/models'); //INIT - Test Singelton
require('./components/scanner')(io); //INIT - Test Singelton


// Start server
server.listen(config.port, config.ip, function () {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
