'use strict';

const session 	= require('express-session');
const MongoStore	= require('connect-mongo')(session);
const db 		    = require('../database');
const config 		= require('../config');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */

const init = function () {
	  return session({
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: false,
			unset: 'destroy',
			store: new MongoStore({ mongooseConnection: db.Mongoose.connection })
		});
};

module.exports = init();