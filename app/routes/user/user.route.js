const express = require('express');
const userController = require('./user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/status')
    .get(userController.GetAllUserStatus);

router.route('/:userId')
    .get(userController.GetUserStatus);


module.exports = router;
