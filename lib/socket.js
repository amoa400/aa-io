var EventEmitter = require('events').EventEmitter;

/**
 * aa-io Socket
 *
 * @param {Object} socket
 * @param {Object} server
 * @api public
 */
function Socket(socket, server) {
  // inherit from EventEmitter
  for (var i in EventEmitter.prototype) {
    this.__proto__[i] = EventEmitter.prototype[i];
  }
  // engine.io socket
  this.eSocket = socket;
  // aaio server
  this.server = server;
  // id
  this.id = socket.id;
  // create time
  this.createTime = parseInt(new Date().getTime() / 1000);
  // active time
  this.activeTime = this.createTime;
  // status
  this.status = 'connected';
  // event
  this.eSocket.on('message', this.onMessage.bind(this));
  this.eSocket.on('heartbeat', this.onHeartbeat.bind(this));
  this.eSocket.on('close', this.onClose.bind(this));
}
module.exports = Socket;

/**
 * receive message from client
 *
 * @param {Object} message
 * @api private
 */
Socket.prototype.onMessage = function(data) {
  // parse the data
  try {
    data = JSON.parse(data);
    if (typeof data !== 'object')
      throw new Error();
  }
  catch (e) {
    this.send({error: 'message format error'});
    return;
  }

  // is alive
  if (this.status != 'connected') {
    this.send({error: 'connection has been closed'});
    return;
  }

  // emit message
  this.activeTime = parseInt(new Date().getTime() / 1000);
  this.server.emit('message', this, data);
}

/**
 * heartbeat from client
 *
 * @api private
 */
Socket.prototype.onHeartbeat = function() {
  this.activeTime = parseInt(new Date().getTime() / 1000);
}

/**
 * closed
 *
 * @api private
 */
Socket.prototype.onClose = function() {
  this.status = 'closed';
  this.server.emit('leave', this);
}

/**
 * send message
 *
 * @param {Object} message
 * @api public
 */
Socket.prototype.send = function(data) {
  if (typeof data != 'object') return false;
  this.eSocket.send(JSON.stringify(data));
}
