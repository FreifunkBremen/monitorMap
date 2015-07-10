'use strict';

// Development specific configuration
// ==================================
module.exports = {
	DOMAIN:'http://localhost:9000',

	scanner:{
		ipv6_prefix:'fe80::',
		ipv6_interface:'et0.2',
		ipv6_pingall:'ff02::1',
		//timer_ping:10, //sec
		//timer_count:3,
		//timer_alfred:50,
		timer_announce:5,
		//socket_alfred:"/tmp/alfred",
		latitude:53.0698,
		longitude:8.8154,
		default_channel_24:11,
		default_channel_50:140,
		default_channel_50_power:10,
		default_channel_24_power:10,
	},
	ip:'0.0.0.0',
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
