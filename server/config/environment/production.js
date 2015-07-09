'use strict';

// Production specific configuration
// =================================
module.exports = {
	DOMAIN:'http://localhost:9000',
	scanner:{
		ipv6_prefix:'2001:1a80:303b:0',
		ipv6_interface:'2001:1a80:303b:0:ba76:3fff:fed3:6e5c',
		ipv6_pingall:'ff02::1',
		timer_ping:10, //sec
		timer_count:3,
		timer_alfred:50,
		socket_alfred:"/tmp/alfred",
		latitude:53.0698,
		longitude:8.8154,
		default_channel_24:11,
		default_channel_50:140,
		default_channel_50_power:10,
		default_channel_24_power:10,
	},
	// Server IP
	ip:       process.env.IP ||
						undefined,

	// Server port
	port:     process.env.PORT ||
						8080,

	// MySQL connection options
	database: {
		db:    process.env.MYSQL_DB ||
						'monitormap',
		user:    process.env.MYSQL_USER ||
						'monitormap',
		password:    process.env.MYSQL_PASSWORD ||
						'monitormap',
		host:    process.env.MYSQL_HOST ||
						'localhost',
		port:    process.env.MYSQL_PORT ||
						3306
	}
};
