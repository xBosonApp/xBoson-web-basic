var conf = require('../index.js');
var console = require('../lib/logger.js');

var c = conf.load();
console.log("config is: \n", c);

c.aa = 'test';
conf.save(c);

var d = conf.load();
console.log('must true:', d.aa == c.aa);
