var lib = require('../index.js');
var console = require('../lib/logger.js');


lib.wait_init(function() {
  lib.wait_init(function() {
    console.log('******************** Config init over');
  });
  require('./test-extends.js');
  require('./test-conf.js');
  require('./test-ext.js');
  require('./test-dir.js');

  console.log('sys config:', lib.userdata)
});
