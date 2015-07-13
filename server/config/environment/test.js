'use strict';

// Test specific configuration
// ===========================
module.exports = {
	DOMAIN:'http://localhost:9000',
	// MySQL connection options
	database: {
		db:    process.env.MYSQL_DB ||
						'bitstausch',
		user:    process.env.MYSQL_USER ||
						'bitstausch',
		password:    process.env.MYSQL_PASSWORD ||
						'bitstausch',
		host:    process.env.MYSQL_HOST ||
						'localhost',
		port:    process.env.MYSQL_PORT ||
						3306
	}
};
