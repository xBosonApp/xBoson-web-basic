var userdata = require('./lib/syspath.js')();

module.exports = {
  auto_init : auto_init,
  userdata  : userdata,
  nodeconf  : userdata + '/node-config/',
};


ext('./lib/configuration.js');
ext('./lib/dir.js');
ext('./lib/extends.js');


function ext(src) {
  src = require(src);
  for (var n in src) {
    module.exports[n] = src[n];
  }
}


function auto_init(over_cb) {
  var clib = module.exports;
  clib.wait_init(function() {
    var conf = clib.load();
    clib.save(conf, function() {
      over_cb(conf);
    });
  });
}
