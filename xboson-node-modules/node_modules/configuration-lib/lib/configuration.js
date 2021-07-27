var default_conf = require('../config/default.js');
var logger       = require('./logger.js');
var ex           = require('./extends.js').extends;
var fs           = require('fs');
var path         = require('path');
var Event        = require('events').EventEmitter;

var config       = null;
var _init        = false;
var _wait_init   = new Event();
var NULL;

init();

module.exports = {
  load : load,
  save : save,
  wait_init : wait_init,
  saveNomerger : saveNomerger,
};


//
// 这个方法永远只会被调用一次
//
function init() {
  if (_init) return;
  _init = true;

  var config_file = process.cwd() + '/config/config.js';
  var outconf = null;

  try {
    outconf = require(config_file);
    var c = 0;
    for (var __i in outconf) {
      c++; break;
    }
    if (c == 0) {
      logger.log("找到配置文件: [", config_file, "] 但没有配置项, 是否未用 [module.exports] 导出?");
    }
  } catch(err) {
    logger.log("读取配置文件错误:", config_file, err.message);
  }

  config = ex(default_conf, outconf);
  init_ext(_send_over);
  logger();
}


function init_ext(next) {
  if (!config.ext_config_file) {
    next && next();
    return;
  }

  try {
    config.ext_config_file = path.normalize(config.ext_config_file);
    var txt = fs.readFileSync(config.ext_config_file, {encoding:'utf8'});
    var _model_nm = module.parent.parent.id;

    try {
      var ext_config = JSON.parse(txt);
      config = ex(config, ext_config);
      logger.log('Load ext config from ', config.ext_config_file, '< [', _model_nm, ']');
    } catch(err) {
      logger.log('Load ext config fail, use default config', err.message, 
        '< [', _model_nm, '] from', config.ext_config_file);
    } finally {
      next && next();
    }

  } catch(err) { // 读取失败会走到这里
    _save_to_file(next);
  }
}


function _save_to_file(next) {
  if (!config.ext_config_file) {
    next && next();
    return;
  }

  //
  // 使用系统配置作为默认配置, 保存到本地文件中
  // 重新部署, 配置也能保留
  //
  var ext = config.ext_config_file = path.normalize(config.ext_config_file);
  var txt = JSON.stringify(config, null, 2);
  var dir = path.dirname(ext);

  try {
    require('./dir.js').mkdir(dir);
  } catch(err) {
    logger.log('Make dir fail', dir, err);
  }

  fs.writeFile(config.ext_config_file, txt, function(err) {
    logger.log(err ? err.message : ('Save ext config ' + ext));
    next && next();
  });
}


function load() {
  return ex(config);
}


function save(_new, _save_over) {
  config = ex(config, _new);
  _save_to_file(_save_over);
}


function saveNomerger(_new, _save_over) {
  config = _new;
  _save_to_file(_save_over);
}


function _send_over() {
  if (!_wait_init) return;
  _wait_init.emit('initover', load());
  _wait_init = NULL;
}


function wait_init(fn) {
  if (_wait_init) {
    _wait_init.once('initover', fn);
  } else {
    fn(load());
  }
}
