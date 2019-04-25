
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
  GetConversations: (request, response, next) => {
    response.send(200);

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
};
