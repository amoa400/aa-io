var engine = require('engine.io');
var Server = require('./server');

/**
 * AAio
 *
 * @api public
 */
function AAio() {
}

/**
 * start server
 * listen on the port via engine.io
 *
 * @param {Number} port
 * @param {Object} options
 * @return {Object} aa-io server
 * @api public
 */
AAio.prototype.listen = function(port, options) {
  var server = engine.listen(port, options);
  return new Server(server, options);
}

module.exports = AAio;

