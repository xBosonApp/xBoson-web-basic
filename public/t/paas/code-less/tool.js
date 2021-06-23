/* Create By xBoson System */
const store = require("./store.js");
const requirePlugin = {};

module.exports = {
  api,
  apiurl,
  filesort,
  loadPlugins,
  deepCopy,
};


function api(mod, name, params, cb) {
  let url = [window.xv.ctx_prefix, 'app/a297dfacd7a84eab9656675f61750078/19cb7c3b79e949b88a9c76396854c2b1', 
            mod, name].join('/');
            
  params.prjid = store.state.project._id;
  apiurl(url, params, cb);
}


function apiurl(url, params, cb) {
  let config = {
    emulateJSON : true,
  };
  
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


function filesort(a, b) {
  if (a.isDir == b.isDir) {
    return a.name == b.name ? 0 : (a.name > b.name ? 1 : -1);
  } else if (a.isDir) {
    return -1;
  }
  return 1;
}


function loadPlugins(plugins) {
  for (let n in plugins) {
    let p = requirePlugin[n];
    if (requirePlugin[n]) {
      if (p.path != plugins[n]) {
        console.warn("插件", n, '从不同文件加载', plugins[n], '=>', p.path);
      }
      continue;
    }
    
    Vue.component(n, require(plugins[n], 1,1));
    requirePlugin[n] = {
      path : plugins[n],
      type : getPluginType(plugins[n]),
    };
  }
}


function getPluginType(file) {
  if (file.endsWith('.vue')) {
    return 'vue';
  }
  if (file.endsWith('.js')) {
    return 'js';
  }
  throw new Error("unknow plugin "+ file);
}


// 只支持扁平对象
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}