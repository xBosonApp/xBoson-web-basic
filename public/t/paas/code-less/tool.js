/* Create By xBoson System */
const store = require("./store.js");
const requirePlugin = {};

module.exports = {
  api,
  apiurl,
  filesort,
  loadPlugins,
  deepCopy,
  makeComponents,
  regc,
  loadc : makeComponents,
  getRoot,
  getEditFile,
  delayWorker,
};


function api(mod, name, params, cb) {
  // TODO: 切换org
  let url = [window.xv.ctx_prefix, 'app/a297dfacd7a84eab9656675f61750078/19cb7c3b79e949b88a9c76396854c2b1', 
            mod, name].join('/');
            
  params.prjid = store.state.project._id;
  apiurl(url, params, cb);
}


function apiurl(url, params, cb) {
  let p = Vue.xapi(url, params);
  p.then(ret => {cb(null, ret)}).catch(cb);
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


function makeComponents(arr) {
  let c = {};
  arr.forEach(n => {
    c[n] = require('./'+ n +'.vue', 1, 1);
  });
  return c;
}


function regc(name) {
  Vue.component(name, require('./'+ name +'.vue', 1,1));
}


function getEditFile() {
  return store.state.editFile;
}


function getRoot() {
  let f = getEditFile();
  if (f) {
    return f.content.root;
  }
}


// 创建 fn 的包装函数, 尽可能推迟多个调用合并为一个
function delayWorker(fn, time) {
  if (!time) time = 2e3;
  let wait = 0;
  
  return function() {
    wait++;
    setTimeout(()=>{
      --wait;
      if (wait == 0) {
        fn();
      }
    }, time);
  };
}