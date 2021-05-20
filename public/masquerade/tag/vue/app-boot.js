/* Create By xBoson System */
(function() {
  const cdn_path = document.getElementById('cdn-path').dataset["cdnPath"];
  const cdnpre = 'cdn/';
  // 全局模块, 通过 defineModule 定义
  const export_modules = {};
  // path 模块
  let pathmod;
  
  // 导出到全局变量
  const export_global = {
    defineModule,
    loadCdn,
  };
  
  checkEnv();
  export_to_global();
  
  
  function export_to_global() {
    for (let name in export_global) {
      if (window[name]) {
        console.warn("在导出 window."+ name, '时冲突');
        continue;
      }
      window[name] = export_global[name];
    }
  }
  
  
  function defineModule(name, module) {
    if (!name) throw new Error("must have name");
    if (!module) throw new Error("must have module");
    if (!module.exports) throw new Error("must have module.exports");
    export_modules[name] = module;
  }
  
  
  function checkEnv() {
    if (window.zy) {
      // alert('vue app 不支持在 zy 环境下开发, 即将跳转');
      let path = location.href.substr(location.href.lastIndexOf('#') +1);
      location.href = zy.g.host.ui +'/'+( zy.debug?'t':'ui' )+'/'+ path;
    } else {
      // 该脚本最先执行, 所有的程序库都没有加载, 必须等待
      window.addEventListener('load', pre_init);
    }
  }
  
  
  function pre_init() {
    if (window.require) throw new Error("require 全局冲突");
    
    Vue.http.head(location.href).then((res)=>{
      let fullPath = res.headers.get('Full-Path');
      boot(fullPath);
    }).catch((err)=>{
      alert("错误 "+ err.message);
      console.error(err);
    });
  }
  
  
  function boot(fullPath) {
    let prefix = location.href.substr(0, location.href.indexOf(fullPath));
    pathmod = lite_require(cdn_path +"path-browserify/1.0.1/index.js");
    
    let basePath = pathmod.dirname(fullPath);
    let rootModule = createRootModule(prefix, basePath, cdn_path);
      
    defineModule('path', {exports: pathmod});
    window.require = rootModule.require;
    window.debug = window._xboson_debug = basePath.startsWith("/t");
    boot_vue();
  }
  
  
  function boot_vue() {
    new Vue({
      el : '#xboson_vue_app_root_dom',
      components : {
        'boot-component' : require('./app.vue'),
      },
      errorCaptured(err, vm, info) {
        console.error("Vue app Error:", vm, info, err);
        // ElementUI 提供
        if (this.$notify) {
          this.$notify.error({
            title: 'Vue app 错误' +info,
            message: err.message,
            dangerouslyUseHTMLString: true,
          });
        }
      }
    });
  }
  
  
  function lite_require(s) {
    let wcode = '(function(module, exports) {'+
                  syncload(s) +
                '})';
    let mod = {exports:{}};
    eval(wcode)(mod, mod.exports);
    return mod.exports;
  }
  
  
  function loadCdn(path) {
    let code = syncload(cdn_path + path);
    try {
      return eval(code);
    } catch(e) {
      console.error("Load cdn", path, "fail:", e.stack);
    }
  }
  
  
  function syncload(url, data) {
    console.debug('sync ajax', url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(data);
    if (xhr.status === 200) {
      return xhr.responseText;
    }
    throw new Error(xhr.status +':'+ xhr.responseText);
  }
  
  
  function createRootModule(urlprefix, _base, _cdn_path) {
    return createModule(urlprefix, { 
      exports: {},
      _cache: {},
      _base,
      _cdn_path,
    });
  }
  
  
  function createModule(urlprefix, _parent) {
    let mod = { 
      exports: {},
      _cache    : _parent._cache,
      _base     : _parent._base,
      _cdn_path : _parent._cdn_path,
      require,
    };
    
    //
    // 全能 require, 规则:
    // 1. 如果以 'cdn/' 开头, 则使用 cjs 同步加载模块, 返回模块的导出
    // 2. 如果 name 存在于全局中, 则直接返回
    // 3. 以 './' 开头的文件以当前引入页面作为根目录, 同步加载模块.
    // 4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
    //
    function require(name) {
      let rmod;
      do {
        rmod = export_modules[name];
        if (rmod) {
          console.debug("require from export_modules", name);
          break;
        }
        
        rmod = mod._cache[name];
        if (rmod) {
          console.debug("require from cache", name);
          break;
        }
        
        if (name.startsWith(cdnpre)) {
          console.debug("require from cdn", name);
          let p = _parent._cdn_path + name.substr(cdnpre.length);
          rmod = loadModule(p);
        }
        else if (name.startsWith("./") || name.startsWith('../')) {
          console.debug("relatively require", mod._base, '>',name);
          let p = pathmod.join(mod._base, name);
          rmod = loadModule(p);
        }
        else if (name[0] == '/') {
          console.debug("absolute require", name);
          rmod = loadModule(name);
        }
        
        if (!rmod) {
          throw new Error("require() cannot load "+ name);
        }
        mod._cache[name] = rmod;
        
      } while(false);
      
      return _return(name, rmod);
    }
    
    
    function _return(name, mod) {
      if (mod.exports && mod.exports.__esModule) {
        return mod.exports.default;
      }
      return mod.exports;
    }
    
    
    function loadModule(absPath) {
      if (absPath[absPath.length-1] == '/') absPath += 'index.js';
      let code = syncload(urlprefix + absPath);
      let wcode = '(function(module, require, exports) {'+
                    code +
                  '})';
      let fn = eval(wcode);
      let module = createModule(urlprefix, mod);
      module._base = pathmod.dirname(absPath);
      fn(module, module.require, module.exports);
      return module;
    }
    
    return mod;
  }
})();