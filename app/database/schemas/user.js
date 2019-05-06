'use strict';

const Mongoose 	= require('mongoose');
require('mongoose-long')(Mongoose);

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";
const Long = Mongoose.Schema.Types.Long;

const UserSchema = new Mongoose.Schema({
    user_id: { type: Long,},
    status: { type: Boolean,},
    updated_at: { type: Date,},
});



// Create a user model
const userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;