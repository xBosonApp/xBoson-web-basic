var os = require('os');

//
// 不可以引入 logger.js
//
module.exports = get_sys_config_path;


function get_sys_config_path() {
  var getter = {

    'Windows_NT'  : _Windows_NT,
    'Linux'       : _Linux,

  }[os.type()];


  if (getter) {
    return getter();
  } else {
    console.log('Config cannot support ' + os.type() + 'os, default path set.');
    return './';
  }
}


function _Windows_NT() {
  var ev = process.env;
  return ev['APPDATA']
      || ev['LOCALAPPDATA']
      || ev['ALLUSERSPROFILE'];
}


function _Linux() {
  var ev = process.env;
  return ev['HOME']
      || '/usr/etc';
}
