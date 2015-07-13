'use strict';

// Development specific configuration
// ==================================
module.exports = {
	DOMAIN:'http://localhost:9000',

	scanner:{
		ipv6_prefix:'fe80::',
		ipv6_interface:'eth0',
		ipv6_pingall:'ff02::1',
		meshviewer:'http://downloads.bremen.freifunk.net/data/',
		timer_announce:5,
		timer_meshviewer:360,
		latitude:53.0698,
		longitude:8.8154,
		channels_24:[1,5,9,13],
		channels_50:[36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
		default_channel_50_power:10,
		default_channel_24_power:10,
	},
	ip:'0.0.0.0',
	// MySQL connection options
	database: {
		postgres:true,
		db:    'monitoring',
		user:  'monitoring',
		password:    null
	}
};
