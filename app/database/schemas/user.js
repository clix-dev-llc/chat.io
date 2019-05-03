'use strict';

const Mongoose 	= require('mongoose');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

const UserSchema = new Mongoose.Schema({
    user_id: { type: Number,},
    status: { type: Boolean,},
    updated_at: { type: Date,},
});



// Create a user model
const userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;