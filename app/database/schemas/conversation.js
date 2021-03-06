'use strict';

const Mongoose  = require('mongoose');
require('mongoose-long')(Mongoose);

/**
 * Each connection object represents a user connected through a unique event2.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
const Long = Mongoose.Schema.Types.Long;

const ConversationSchema = new Mongoose.Schema({
  conversation_id : {type: Number, required: true },
  conversation_name : { type: String, required: true },
  members: { type: [Long], required: true },
  type: { type: String, required: true },
  created_at : {type: Date, required: true },
  updated_at : {type: Date, required: true },
  latest_message : { type: Mongoose.Schema.Types.Mixed, required: true },
});

ConversationSchema.virtual('messages', {
  ref: 'message',
  localField: 'conversation_id',
  foreignField: 'conversation_id',
});

const conversationModel = Mongoose.model('conversation', ConversationSchema);

module.exports = conversationModel;