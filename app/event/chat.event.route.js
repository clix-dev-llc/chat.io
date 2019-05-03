const upmEventService = require('./chat.event.service');
const { getErrorResponse } = require('../utils/responseGenerator');
const userService = require('../routes/user/user.service');

// const handleSocketError = (socket, error, eventName) => {
//   const errorResponse = getErrorResponse(error, null, null);
//   console.log(errorResponse.httpStatusCode, errorResponse.body);
//   const response = { code: errorResponse.httpStatusCode, message: errorResponse.body };
//   socket.emit(`${eventName}/callback`, response);
// };
//
// const handleSocketResponse = (io, socket, eventNameForBroadcast, eventNameForUser, requestId, EventResponseForBroadcast, EventResponseForUser) => {
//   io.sockets.emit(eventNameForBroadcast, EventResponseForBroadcast);
//   socket.emit(`${eventNameForUser}/callback`, EventResponseForUser);
// };

const handleChatEvent = (io, socket, uid, next) => {

  socket.on('join', function(conversationId) {
    socket.join(conversationId);
  });

  socket.on('disconnect', function() {

    // update user status in database at the time of disconnection
    if(socket.handshake.query.uid) {
      userService.updateUserStatus(socket.handshake.query.uid, false);
      io.of('/chatroom').emit('userStatus',{
        userId : socket.handshake.query.uid,
        status : false,
        updatedAt: new Date().getTime()
      })
    }
    if(socket.request.session.passport == null){
      return;
    }
  });

  socket.on('newMessage', function(message) {
    const requestId = message.request_id;
    const conversationId = message.conversationId;
    chatService.addNewMessage(conversationId, message)
        .then(messageDetail => {
          socket.broadcast.to(conversationId).emit('addMessage', messageDetail);
          if(requestId) {
            messageDetail.request_id = request_id;
            socket.emit('messageCallback',messageDetail);
          }
        }).catch(error => {
      console.log(error);
    })
  });

};

// socket.on(SocketEventName.ADD_PROJECT_COMMENT, async (data) => {
//   try {
//     const projectCommentDetail = await upmEventService.addProjectComment(data, uid);
//     const response = { code: 204, requestId: data.requestId };
//     const socketEventName = `${SocketEventName.ADD_PROJECT_COMMENT}/${projectCommentDetail.projectId}`;
//     handleSocketResponse(io, socket, socketEventName, SocketEventName.ADD_PROJECT_COMMENT, data.requestId, projectCommentDetail, response);
//   } catch (error) {
//     handleSocketError(socket, error, SocketEventName.ADD_PROJECT_COMMENT);
//   }
// });

module.exports.InitUpmEvent = (io) => {
  io.use((socket, next) => {

    const userId = socket.handshake.query.uid;
    if(userId) {
      userService.updateUserStatus(socket.handshake.query.uid, true);
      io.emit('userStatus',{
        userId : socket.handshake.query.uid,
        status : true,
        updatedAt: new Date().getTime()
      });
      socket.username = userId;
      socket.uid = userId;
      next();
    }
  });

  io.on('connection', (socket, next) => {
    console.log('New user connected');
    handleChatEvent(io, socket, socket.uid, next);
  });
};
