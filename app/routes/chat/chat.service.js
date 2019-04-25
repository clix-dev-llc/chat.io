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
    const messages = await Message.find(query);
    delete conversationModel._id;
    delete conversationModel.__v;
    conversationModel.messages = messages;
    return conversationModel;
    }
    catch(error) {
      return new Error("NOT_FOUND");
    }
  },

  addNewMessage: (conversationId, messageInfo) =>{
    const message = new Message({
      conversation_id: -2093582676,
      from : 123456,
      text : messageInfo.content,
      timestamp: messageInfo.date,
      status: 'SENT'
    });

    return message.save().then(messageModel =>{
    return messageModel.toObject();
    })
    // console.log(messageModel.toObject());
  }
};