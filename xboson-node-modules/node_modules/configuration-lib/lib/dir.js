var fs      = require('fs');
var path    = require('path');
var console = require('./logger.js');


module.exports = {
  mkdir : mkdir,
  rmdir : rmdir,
};


//
// 递归创建目录, 同步方法
// 必须是一个绝对路径, 否则会出现逻辑错误
// 如果有错误发生返回 true
//
function mkdir(p) {
  var ar = path.normalize(p).split(path.sep);
  var d = ar[0] || '/';
  var haserr = false;

  for (var i=1, e=ar.length; i<e; ++i) {
    try {
      d = d + path.sep + ar[i];
      fs.mkdirSync(d);
      console.log('Configuration Make dir', p);
    } catch(err) {
      if (err.code != 'EEXIST') {
        throw err;
        haserr = true;
      }
    }
  }

  return haserr;
}


//
// 递归删除目录, 包括目录本身, 同步的
//

function rmdir(basedir) {

  _dir(basedir);


  function _dir(currpath) {
    var dirs;
    var dir_a = [];
    var file_a = [];

    try {
      dirs = fs.readdirSync(currpath);
    } catch(err) {
      console.log('GET Dir fail', currpath, err.message);
      return;
    }

    dirs.forEach(function(f) {
      var filen = path.join(currpath, f);
      var ig;

      var stat = fs.statSync(filen);
      if (stat.isDirectory()) {
        dir_a.push({ f: filen, c: f});
      }
      else if (stat.isFile()) {
        file_a.push({ f: filen, c: f });
      }
    });


    file_a.forEach(function(o) {
      try {
        console.log(o.f)
        fs.unlinkSync(o.f);
      } catch(e) {
        console.log('DEL file', e.message);
      }
    });

    dir_a.forEach(function(o) {
      _dir(o.f);
      try {
        fs.rmdirSync(o.f);
      } catch(e) {
        console.log('DEL dir', e.message);
      }
    });

    try {
      console.log('Remove', currpath)
      fs.rmdirSync(currpath);
    } catch(e) {
      console.log('DEL dir', e.message);
    }
  }

}
