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
    const query = {'conversation_id': -2093582676 };
    const updatedData = {'updated_at': new Date()};
    const message = new Message({
      conversation_id: -2093582676,
      from : 123456,
      to : 234,
      text : messageInfo.content,
      timestamp: new Date(),
      status: 'SENT'
    });

    return message.save().then(messageModel => {
       Conversation.findOneAndUpdate(query, updatedData, {upsert:true}).then(data => {
        return messageModel.toObject();
      });
    });
    // console.log(messageModel.toObject());
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