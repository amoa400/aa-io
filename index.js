var traceur = require('traceur');
traceur.require.makeDefault(function(path) {
  return path.indexOf('node_modules') == -1;
});

module.exports = require('./lib/index').default;
