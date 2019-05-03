'use strict';

const config 	= require('../config');
const redis 	= require('redis').createClient;
const adapter = require('socket.io-redis');
const chatService = require('../routes/chat/chat.service');
const userService = require('../routes/user/user.service');

const ioEvents = (io) => {

	io.of('/chatroom').on('connection', function(socket) {
      if(socket.handshake.query.uid) {
        userService.updateUserStatus(socket.handshake.query.uid, true);
        io.of('/chatroom').emit('userStatus',{
        userId : socket.handshake.query.uid,
        status : true,
        updatedAt: new Date().getTime()
        })
      }

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

		socket.on('newMessage', function(conversationId, message) {
          const requestId = message.request_id;

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
    });
};


const init = function(app){

	const server 	= require('http').Server(app);
	const io 		= require('socket.io')(server);

	io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});
    ioEvents(io);
    return server;
};

module.exports = init;