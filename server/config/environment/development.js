'use strict';

// Development specific configuration
// ==================================
module.exports = {
	DOMAIN:'http://localhost:9000',

	scanner:{
		ipv6_prefix:'fe80::',
		ipv6_interface:'wl0',
		ipv6_pingall:'ff02::1',
		meshviewer:'http://downloads.bremen.freifunk.net/data/',
		timer_ping_downtime:true,
		timer_ping:1, //sec
		timer_ping_count:3,
		timer_ping_offline:50,
		timer_ping_between: 5,
		//timer_alfred:50,
		timer_announce:15,
		timer_announce_between:10,
		//timer_announce_find:30,
		timer_meshviewer:360,
		//socket_alfred:"/tmp/alfred",
		latitude:53.0698,
		longitude:8.8154,
		channels_24:[1,5,9,13],
		channels_50:[36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
		default_channel_50_power:10,
		default_channel_24_power:10,
	},
	passphrase:'funk',
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
