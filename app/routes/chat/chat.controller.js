
const chatService = require('./chat.service');

module.exports = {
  CreateNewConversation: async (request, response, next) => {
    const { currentUserId , userId}=  request.body ;
    try {
     const conversationDetail = await chatService.CreateNewConversation(currentUserId, userId);
     response.send(conversationDetail).status(200);
    }
    catch(error) {
      next(error);
    }
  },
  GetConversations: async (request, response, next) => {
    try{
      const conversationList = await chatService.getConversationList(request.headers.uid);
      response.send(conversationList).status(200);
    }
    catch(error){
      next(error);
    }
  },
  UpdateConversation: (request, response, next) => {
    response.send(409);

  },
  GetConversation: async (request, response, next) => {
    const { userId }=  request.params;
    const { uid }=  request.headers;

    try {
      const conversationDetail = await chatService.getConversation(uid, userId);
      response.send(conversationDetail).status(200);
    }
    catch(error) {
      next(error);
    }
  },
  GetConversationList: async (request, response, next) => {
    const { uid }=  request.headers;

    try {
      const conversationDetail = await chatService.getConversationList(uid);
      response.send(conversationDetail).status(200);
    }
    catch(error) {
      next(error);
    }
  }
};
