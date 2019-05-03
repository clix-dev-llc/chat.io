'use strict';

const express	 	= require('express');
const router 		= express.Router();
const passport 	= require('passport');

const userRoutes = require('./user/user.route');
const chatRoutes = require('./chat/chat.route');

router.use('/conversation', chatRoutes);
router.use('/user', userRoutes);

module.exports = router;