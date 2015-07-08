'use strict';

// Development specific configuration
// ==================================
module.exports = {
	DOMAIN:'http://localhost:9000',

	scanner:{
		ipv6_prefix:'2001:bf7:540:0',
		ipv6_interface:'2001:bf7:540:0:4823:deff:fe52:4488',
		ipv6_pingall:'ff02::1',
		timer_ping:10, //sec
		timer_count:3,
		timer_alfred:50,
		socket_alfred:"/tmp/alfred",
		latitude:53.0698,
		longitude:8.8154
	},
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
