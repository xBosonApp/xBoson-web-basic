/* Create By xBoson System */
const store = require("./store.js");

module.exports = {
  api,
};


function api(mod, name, params, cb) {
  let url = [window.xv.ctx_prefix, 'app/a297dfacd7a84eab9656675f61750078/19cb7c3b79e949b88a9c76396854c2b1', 
            mod, name].join('/');
            
  let config = {
    emulateJSON : true,
  };
  params.prjid = store.state.project._id;
  if (window.xv.debug) {
    params.s = 'd';
  }
  
  Vue.http.post(url, params, config).then(resp=>{
    resp.json().then(ret=>{
      if (ret.code) {
        return cb(new Error(ret.msg));
      }  
      cb(null, ret);  
    }, err=>{
      cb(err);
    });
  }).catch(resp=>{
    cb(new Error(resp.statusText));
  });
}