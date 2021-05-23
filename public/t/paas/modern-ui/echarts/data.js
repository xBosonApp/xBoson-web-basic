/* Create By xBoson System */
// const path = require("path");

module.exports = {
  get,
  getJSON : get,
};

let remove1 = '/data/asset/data/';

//
// 返回 Promise 用于异步加载 data 中的数据, 

// url - 无需加 data 前缀
// cb:Function(code) - 同步返回 option
//
function get(url, cb) {
  if (url.startsWith(remove1)) {
    url = url.substr(remove1.length);
  }
  
  let p = window.url_prefix + __dirname +'/data/'+ url;
  console.debug("Chart load", url);
  
  return new Promise(function(ok, fail) {
    Vue.http.get(p).then(function (res) {
      // console.log(res);
      if (res.ok) {
        ok(cb(res.body));
      } else {
        fail(new Error("Cannot load chart data from \n"+ p));
      }
    }, function(err) {
      console.error(err);
      fail(new Error("Cannot load chart data from\n"+ p));
    });
  });
}