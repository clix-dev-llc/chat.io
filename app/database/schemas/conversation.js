'use strict';

const Mongoose  = require('mongoose');

/**
 * Each connection object represents a user connected through a unique event2.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
const ConversationSchema = new Mongoose.Schema({
  conversation_id : {type: Number, required: true },
  conversation_name : { type: String, required: true },
  members: { type: [Number], required: true },
  type: { type: String, required: true },
  created_at : {type: Date, required: true },
  updated_at : {type: Date, required: true },
});

ConversationSchema.virtual('messages', {
  ref: 'message',
  localField: 'conversation_id',
  foreignField: 'conversation_id',
});

const conversationModel = Mongoose.model('conversation', ConversationSchema);

module.exports = conversationModel;