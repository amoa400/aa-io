var aaio = require('./lib/index');
var log = require('util').log;

log('aa-io listening on port 6678');
var server = new aaio().listen(6678, {
  authorizeFunc: function(token) {
    return token == '123';
  }
});

server.on('connection', function(socket) {
  log('new connection, id: ' + socket.id);
});

server.on('message', function(socket, message) {
  log('message, id: ' + socket.id + ', content: ' + JSON.stringify(message));
  socket.send({received: 1, data: message.n});
});

server.on('leave', function(socket) {
  log('leave, id: ' + socket.id);
});

setInterval(function() {
  var len = 0;
  for (var i in server.clients) {
    len++;
  }
  log('total clients: ' + len);
}, 5000);
