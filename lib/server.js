var EventEmitter = require('events').EventEmitter;
var Socket = require('./socket');

/**
 * aa-io Server
 *
 * @param {Object} server
 * @param {Object} options
 * @api public
 */
function Server(server, options) {
  options = options || {};

  // inherit from EventEmitter
  for (var i in EventEmitter.prototype) {
    this.__proto__[i] = EventEmitter.prototype[i];
  }
  // engine.io server
  this.eServer = server;
  // clients
  this.clients = {};
  // authorize function
  this.authorizeFunc = options.authorizeFunc ? options.authorizeFunc : function() {return true};
  // event
  this.eServer.on('connection', this.onConnection.bind(this));
  this.on('leave', this.onLeave);
}
module.exports = Server;

/**
 * client connected
 *
 * @param {Object} socket
 * @api private
 */
Server.prototype.onConnection = function(socket) {
  // authorize
  var token = socket.request.query.token;
  if (!this.authorizeFunc(token)) {
    socket.emit('close');
    return;
  }

  // add into clients
  socket = new Socket(socket, this);
  this.clients[socket.id] = socket;
  this.emit('connection', socket);
}

/**
 * client leaved
 *
 * @param {Object} socket
 * @api public
 */
Server.prototype.onLeave = function(socket) {
  delete this.clients[socket.id];
}
