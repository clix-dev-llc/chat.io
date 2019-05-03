'use strict';

const express	 	= require('express');
const router 		= express.Router();
const passport 	= require('passport');

const userRoutes = require('./user/user.route');
const chatRoutes = require('./chat/chat.route');

router.route('/')
    .get((request, response) => {
      response.status(200).send({
        status: true,
      });
    });

router.use('/conversation', chatRoutes);
router.use('/user', userRoutes);

module.exports = router;