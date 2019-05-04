'use strict';

const init = function () {
		return {
			db: {
				username: process.env.dbUsername,
				password: process.env.dbPassword,
				host: process.env.dbHost,
				port: process.env.dbPort,
				name: process.env.dbName
			},
			sessionSecret: process.env.sessionSecret,
			redis: {
				host: process.env.redisHost,
				port: process.env.redisPort,
				password: process.env.redisPassword
			}
		};
	  // return require('./config.json');
};

module.exports = init();
