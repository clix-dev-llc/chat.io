'use strict';

const Mongoose  = require('mongoose');

const MessageSchema = new Mongoose.Schema({
  conversation_id: { type: Number},
  from : {type: Number, required: true },
  to : {type: Number},
  text : { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const MessageModel = Mongoose.model('message', MessageSchema);

module.exports = MessageModel;