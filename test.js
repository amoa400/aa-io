var aaio = require('./lib/server');
var log = require('util').log;

log('aa-io listening on port 6678');
var server = new aaio(6678, {
  authorizeFunc: function(token, socket, callback) {
    if (token == 123) {
      callback(null, {ok: 1});
    } else {
      callback('error', null);
    }
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
