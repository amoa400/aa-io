import engine from '../wine/engine.io';
import Server from './server';

/**
 * AAio
 *
 * @api public
 */
class AAio {
  /**
   * start server
   * listen on the port via engine.io
   *
   * @param {Number} port
   * @param {Object} options
   * @return {Object} aa-io server
   * @api public
   */
  listen(port, options) {
    var server = engine.listen(port, options);
    return new Server(server, options);
  }

};

export default new AAio();
