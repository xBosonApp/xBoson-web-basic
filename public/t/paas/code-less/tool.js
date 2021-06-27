/* Create By xBoson System */
const store = require("./store.js");
const requirePlugin = {};
const vuever = parseInt(/([0-9]+)\..+/.exec(Vue.version));

module.exports = {
  api,
  apiurl,
  filesort,
  loadPlugins,
  deepCopy,
  makeComponents,
  vuever,
  
  getRoot,
  getEditFile,
  delayWorker,
  
  // Func(name) 全局引入一个组件
  regc,
  // Func(arr) 创建一个对象用于加载多个组件到局部对象
  loadc : makeComponents,
  // Func(name) 返回组件异步加载工厂函数
  requirec,
  // Func(name) 返回组件的加载路径
  pathc,
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
    c[n] = requirec(n); 
  });
  return c;
}


function regc(name) {
  Vue.component(name, requirec(name));
}


function requirec(name) {
  return require(pathc(name), 1, 1);
}


function pathc(name) {
  return './'+ name +'.vue';
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


//
// 创建 fn 的包装函数, 尽可能推迟多个调用合并为一个
// 函数不能有参数
//
function delayWorker(fn, time) {
  if (!time) time = 2e3;
  let wait = 0;
  let tid;
  
  return function() {
    if (arguments.length > 0) {
      throw new Error("cannot have any arguments");
    }
    if (wait) {
      clearTimeout(tid);
    } else {
      wait++;
    }
    tid = setTimeout(()=>{
      --wait;
      if (wait == 0) {
        fn();
      }
    }, time);
  };
}