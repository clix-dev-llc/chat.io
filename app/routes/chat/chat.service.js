const Conversation = require('../../database/index').models.conversation;
const Message = require('../../database/index').models.message;
const {generateChatConversationMembersHash} = require('../../utils/helpers');

module.exports = {
  CreateNewConversation: async (currentUserId, userId) => {
    const userArray = [currentUserId, userId];
    const conversationId = generateChatConversationMembersHash(userArray);
    const conversation = new Conversation({
      _id : conversationId,
      members : userArray,
      type : "IND",
      created_at : new Date().getTime(),
      updated_at : new Date().getTime(),
      message : []
    });
  try {
    const conversationModel = await conversation.save();
    return conversationModel.toObject();
  } catch(error) {
    throw new Error('CONFLICT');
  }
  },

  getConversation: async (currentUserId, userId) => {
    const userArray = [currentUserId, userId];
    const conversationId = generateChatConversationMembersHash(userArray);
    try {
    const query = {conversation_id : conversationId};
    const conversationDetail = {
        conversation_id: conversationId,
        members : userArray,
        type: 'IND',
        created_at : new Date().getTime(),
        updated_at : new Date().getTime(),
        conversation_name : ''+userId
    };
    const conversationModel = await Conversation.findOneAndUpdate(query, conversationDetail, {'upsert':true,'new':true});
    const messages = await Message.find(query, null, {sort: {timestamp: 1}});
    delete conversationModel._id;
    delete conversationModel.__v;
    conversationModel.messages = messages;
    return conversationModel;
    }
    catch(error) {
      return new Error("NOT_FOUND");
    }
  },

  addNewMessage: async (conversationId, messageInfo, uid) => {
    const query = { 'conversation_id': conversationId };
    const message = new Message({
      conversation_id: conversationId,
      from : uid,
      to : messageInfo.to,
      text : messageInfo.text,
      timestamp: new Date(),
      status: 'SENT'
    });

    const messageModel = await message.save();
    const updatedData = { 'updated_at': new Date(), 'latest_message': messageModel.toObject() };
    await Conversation.findOneAndUpdate(query, updatedData, {upsert:true});
    return messageModel.toObject();
    },

  getConversationList: async (currentUserId) => {
    try {
      const query = {members : currentUserId};
      const conversationDetail =[];
      const conversationModel = await Conversation.find(query, null, {sort: {updated_at: -1}});
      conversationModel.forEach(conversation =>{
        conversationDetail.push(conversation.toObject());
      });
      return conversationDetail;
    }
    catch(error) {
      return new Error("NOT_FOUND");
    }
  },

};