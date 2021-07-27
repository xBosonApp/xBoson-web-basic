var log = module.exports = init;

useConsole();


function init() {
  try {
    useLogger();
  } catch(e) {}
}


function useConsole() {
  pack('log');
  pack('info');
  pack('warn');
  pack('error');

  function pack(f) {
    log[f] = function() {
      var arg = [
        '[' + new Date().toLocaleString() + ']',
        '[' + f + ']', 'config -'
      ];
      for (var i=0, e=arguments.length; i<e; ++i) {
        arg.push(arguments[i]);
      }
      console[f].apply(console, arg);
    };
  }
}


function useLogger() {
  var logger  = require('logger-lib')('config');
  log.log     = logger.log;
  log.info    = logger.info;
  log.warn    = logger.warn;
  log.error   = logger.error;
}
