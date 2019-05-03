const socketServer = require('socket.io');
const chatEvent = require('./chat.event.route');
const config 	= require('../config');
const redis 	= require('redis').createClient;
const adapter = require('socket.io-redis');

module.exports.listen = (server) => {
  const io = socketServer.listen(server);
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
  chatEvent.InitUpmEvent(io);
};
