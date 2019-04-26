'use strict';

const config 	= require('../config');
const redis 	= require('redis').createClient;
const adapter = require('socket.io-redis');
const Room = require('../models/room');
const chatService = require('../routes/chat/chat.service');
const userService = require('../routes/user/user.service');

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
const ioEvents = (io) => {

	// Rooms namespace
	io.of('/rooms').on('connection', function(socket) {

		// Create a new room
		socket.on('createRoom', function(title) {
			Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
				if(err) throw err;
				if(room){
					socket.emit('updateRoomsList', { error: 'Room title already exists.' });
				} else {
					Room.create({ 
						title: title
					}, function(err, newRoom){
						if(err) throw err;
						socket.emit('updateRoomsList', newRoom);
						socket.broadcast.emit('updateRoomsList', newRoom);
					});
				}
			});
		});
	});

	// Chatroom namespace
	io.of('/chatroom').on('connection', function(socket) {

	    // update user status in database at the time of connection
      if(socket.handshake.query.uid) {
        userService.updateUserStatus(socket.handshake.query.uid, true);
        io.of('/chatroom').emit('userStatus',{
        userId : socket.handshake.query.uid,
        status : true,
        updatedAt: new Date().getTime()
        })
      }
		// Join a chatroom
		socket.on('join', function(conversationId) {
          socket.join(conversationId);
        });

		// When a socket exits
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
			// Check if user exists in the session
			if(socket.request.session.passport == null){
				return;
			}

			// Find the room to which the socket is connected to, 
			// and remove the current user + socket from this room
			Room.removeUser(socket, function(err, room, userId, cuntUserInRoom){
				if(err) throw err;

				// Leave the room channel
				socket.leave(room.id);

				// Return the user id ONLY if the user was connected to the current room using one socket
				// The user id will be then used to remove the user from users list on chatroom page
				if(cuntUserInRoom === 1){
					socket.broadcast.to(room.id).emit('removeUser', userId);
				}
			});
		});

		// When a new message arrives
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

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
const init = function(app){

	const server 	= require('http').Server(app);
	const io 		= require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
};

module.exports = init;