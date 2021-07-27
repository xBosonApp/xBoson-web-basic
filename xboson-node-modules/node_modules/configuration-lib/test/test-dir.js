var conf = require('../index.js');
var console = require('../lib/logger.js');

var c = conf.load();
c.ext_config_file = conf.nodeconf + '/config-test/config.json';
conf.save(c);
