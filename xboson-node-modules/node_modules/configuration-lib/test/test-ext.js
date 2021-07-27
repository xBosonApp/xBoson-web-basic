var conf = require('../index.js');
var console = require('../lib/logger.js');

conf.save({
  ext_config_file : __dirname + '/data/ext-config.json'

}, function() {
  console.log('Save over');

  var c = conf.load();
  console.log("config is: \n", c);
});
