const chatService = require('../routes/chat/chat.service');
const userService = require('../routes/user/user.service');
const { SocketEventName } = require('../utils/constant');

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

  socket.on(SocketEventName.JOIN_CONVERSATION, (data) => {
    socket.join(data.room_name);
  });

  socket.on(SocketEventName.DISCONNECT, () => {
    if(socket.handshake.query.uid) {
      userService.updateUserStatus(socket.handshake.query.uid, false);
      io.emit(SocketEventName.USER_STATUS_UPDATE ,{
        userId : socket.handshake.query.uid,
        status : false,
        updatedAt: new Date().getTime()
      })
    }
  });

  socket.on(SocketEventName.NEW_MESSAGE, async (message) => {
    const requestId = message.request_id;
    const conversationId = message.conversation_id;
    const messageDetail = await chatService.addNewMessage(conversationId, message);
    const receiver = message.to;
    const sender = message.from;
    socket.broadcast.to(receiver).emit(SocketEventName.RECEIVE_MESSAGE, messageDetail);
    if (requestId) {
      messageDetail.request_id = requestId;
      socket.emit(SocketEventName.MESSAGE_CALLBACK, messageDetail);
    }
  });

  socket.on(SocketEventName.TYPING_INDICATOR, async (data) => {
    data.user_id = uid;
    socket.broadcast.emit(SocketEventName.TYPING_INDICATOR, data);
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

const userConnected = (socket, io, next) => {
  const userId = socket.handshake.query.uid;
  if (userId) {
    userService.updateUserStatus(socket.handshake.query.uid, true);
    io.emit(SocketEventName.USER_STATUS_UPDATE, {
      userId: socket.handshake.query.uid,
      status: true,
      updatedAt: new Date().getTime()
    });
    socket.username = userId;
    socket.uid = userId;
    next();
  }
};

module.exports.InitUpmEvent = (io) => {
  io.use((socket, next) => {
    userConnected(socket, io, next);
  });

  io.on('connection', (socket, next) => {
    console.log('New user connected');
    handleChatEvent(io, socket, socket.uid, next);
  });
};
