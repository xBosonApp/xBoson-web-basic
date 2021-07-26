/* Create By xBoson System */
const store = require("./store.js");
const plib = require("path");
const requirePlugin = {};
const vuever = xv.vuever;

// Not work !
class Vm extends Function {
  constructor(...args) {
    super(...(args.slice(0, -1)));
    
    let name = args[args.length-1];
    Object.defineProperty(object1, 'name', {
      value: name,
      writable: false
    });
  }
}

module.exports = Object.freeze({
  api,
  apiurl,
  filesort,
  loadPlugins,
  deepCopy,
  makeComponents,
  vuever,
  generateFunctionComments,
  generateAutoComments,
  generateReplaceHeader,
  Vm,
  refFunc,
  refVar,
  uiFileExists,
  pageOffset,
  
  getRoot,
  getEditFile,
  delayWorker,
  exts,
  
  // Func(name) 全局引入一个组件
  regc,
  // Func(arr) 创建一个对象用于加载多个组件到局部对象
  loadc : makeComponents,
  // Func(name) 返回组件异步加载工厂函数
  requirec,
  // Func(name) 返回组件的加载路径
  pathc,
  
  checkVar : /^[_a-zA-z\$]+[_a-zA-z\$0-9]*$/,
});


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
  if (typeof obj == 'object') {
    return JSON.parse(JSON.stringify(obj));
  }
  return obj;
}


function makeComponents(arr) {
  let a = Array.isArray(arr) ? arr : arguments;
  let c = {};
  for (let i=0; i<a.length; ++i) {
    c[a[i]] = requirec(a[i]);
  }
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


function generateFunctionComments(opt) {
  return generateAutoComments(o=>{
    o.push('// Function ', opt.name,'(');
    
    if (opt.params.length) {
      opt.params.forEach(p=>{
        o.push(p.pn, ', ');
      });
      o.pop();
    }
    
    o.push(')\n');
    opt.params.forEach(p=>{
      o.push('//   ', p.pn, '\t- ', p.name, '\n');
    });
    
  }).join('');
}


// 用特殊字符序列包装 contentFn 的输出, 使之可以用 
// generateReplaceHeader 进行替换; 输出结尾换行.
function generateAutoComments(contentFn) {
  let o = [
    "// XAutoG:::[\n",
  ];
  contentFn(o);
  o.push('// ]:::');
  return o;
}


function generateReplaceHeader(txt, rtxt) {
  const p = /\/\/ XAutoG:::\[[\S\s]*\]:::/;
  if (p.test(txt)) {
    return txt.replace(p, rtxt);
  } else {
    return rtxt +'\n\n'+ txt;
  }
}

// 抽取 opt 属性覆盖到 def, 返回 def
function exts(def, opt) {
  if (opt) {
    for (let n in opt) {
      def[n] = opt[n];
    }
  }
  return def;
}


function refVar(varName, comment) {
  let r = ['this.', varName];
  if (comment) {
    r.push(' /* ', comment, ' */');
  }
  return r.join('');
}


function refFunc(id, name, params) {
  let len = params.length;
  let n = ['this.', id, '('];
  if (len) {
    for (let i=0; i<len; ++i) {
      n.push('null', ', ');
    }
    n.pop();
  }
  n.push(') /* ', name);
  
  if (len) {
    n.push('(');
    params.forEach(p=>{
      n.push(p.name, ', ');
    });
    n.pop();
    n.push(')');
  }
  n.push(' */');
  return n.join('');
}


function uiFileExists(path) {
  let full = xv.getFullPath(path);
  if (full.startsWith('http://') || full.startsWith('https://')) {
    // do nothing.
  }
  else if (full[0] == '/') {
    full = xv.url_prefix + full;
  } 
  else {
    full = xv.url_prefix +'/'+ full;
  }
  
  return new Promise((ok, fail)=>{
    Vue.http.head(full).then(ok).catch(e=>{
      fail(new Error("找不到文件 "+ e.url));
    });
  });
}


// 返回 dom 在页面中的偏移
function pageOffset(dom) {
  let d = dom;
  let x=0, y=0;
  
  while (d) {
    x += d.offsetLeft;
    y += d.offsetTop;
    let t = d.offsetParent;
    if (t == d) break;
    d = t;
  };
  return {x, y};
}