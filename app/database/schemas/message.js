'use strict';

const Mongoose  = require('mongoose');
require('mongoose-long')(Mongoose);
const Long = Mongoose.Schema.Types.Long;

const MessageSchema = new Mongoose.Schema({
  conversation_id: { type: Number},
  from : {type: Long, required: true },
  to : {type: Long},
  text : { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const MessageModel = Mongoose.model('message', MessageSchema);

module.exports = MessageModel;