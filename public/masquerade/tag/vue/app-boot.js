//
// xBoson Vue app bootloader
// Copyright (c) 上海竹呗信息技术有限公司
// https://xboson.net
//
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
    popError,
    xAppState,
    cdn_path,
  };
  
  const init_state = checkEnv();
  export_to_global();
  
  init_state.catch(function(err) {
    popError('Vue 应用引导错误', err);
  });
  
  
  function export_to_global() {
    for (let name in export_global) {
      if (window[name]) {
        console.warn("在导出 window."+ name, '时冲突');
        continue;
      }
      window[name] = export_global[name];
    }
  }
  
  
  function xAppState() {
    return init_state;
  }
  
  
  function defineModule(name, module) {
    if (!name) throw new Error("must have name");
    if (!module) throw new Error("must have module");
    if (!module.exports) throw new Error("must have module.exports");
    if (!module.name) module.name = name;
    export_modules[name] = module;
  }
  
  
  function checkEnv() {
    return new Promise(function(ok, fail) {
      if (window.zy) {
        // alert('vue app 不支持在 zy 环境下开发, 即将跳转');
        let path = location.href.substr(location.href.lastIndexOf('#') +1);
        location.href = zy.g.host.ui +'/'+( zy.debug?'t':'ui' )+'/'+ path;
      } else {
        // 该脚本最先执行, 所有的程序库都没有加载, 必须等待
        window.addEventListener('load', pre_init(ok, fail), {once:true});
      }
    });
  }
  
  
  function pre_init(ok, fail) {
    return function() {
      if (window.require) return fail(new Error("require 全局冲突"));
      
      Vue.http.head(location.href).then((res)=>{
        let fullPath = res.headers.get('Full-Path');
        boot(fullPath);
        boot_vue();
        ok();
      }).catch((err)=>{
        fail(err);
      });
    }
  }
  
  
  function boot(fullPath) {
    // 从 http:// 开始到 face/ 为止
    let prefix = location.href.substr(0, location.href.indexOf(fullPath));
    pathmod = lite_require(cdn_path +"path-browserify/1.0.1/index.js");
    
    let basePath = pathmod.dirname(fullPath);
    let rootModule = createRootModule(prefix, basePath, cdn_path);
      
    defineModule('path', {exports: pathmod});
    window.require = rootModule.require;
    window.debug = window._xboson_debug = basePath.startsWith("/t");
  }
  
  
  function boot_vue() {
    new Vue({
      el : '#xboson_vue_app_root_dom',
      components : {
        'boot-component' : require('./app.vue', 1, 1),
      },
      errorCaptured(err, vm, info) {
        popError.call(this, "Vue 应用错误: "+ info, err);
      }
    });
  }
  
  
  function popError(title, err) {
    console.error(title, err);
    
    // ElementUI 提供
    if (Vue.prototype.$notify) {
      Vue.prototype.$notify.error({
        title,
        message: err.message,
        dangerouslyUseHTMLString: true,
      });
    } 
    else {
      alert(title +'\n'+ err.message);
    }
  }
  
  
  function lite_require(s) {
    let wcode = '(function(module, exports) {'+
                  syncload(s) +
                '})';
    let mod = {exports:{}};
    eval(wcode)(mod, mod.exports);
    return mod.exports;
  }
  
  
  function loadCdn(path, _not_run) {
    if (path.startsWith(cdnpre)) {
      path = path.substring(cdnpre.length);
    }
    let code = syncload(cdn_path + path);
    if (!_not_run) return code;
    
    try {
      return eval(code);
    } catch(e) {
      console.error("Load cdn", path, "fail:", e.stack);
    }
  }
  
  
  function syncload(url, data) {
    let _return;
    _load_resource(url, data, false, function(err, data) {
      if (err) throw err;
      _return = data;
    });
    return _return;
  }
  
  
  function _load_resource(url, data, use_async, cb) {
    var xhr = new XMLHttpRequest();
    if (use_async) {
      console.debug('Async load', url);
      xhr.addEventListener('load', _check);
      xhr.addEventListener('error', _check);
    }
    xhr.open("GET", url, use_async);
    xhr.send(data);
    if (!use_async) {
      console.debug('Sync load', url);
      _check();
    }
    
    function _check() {
      try {
        if (xhr.status === 200) {
          cb(null, xhr.responseText);
        } else {
          cb(new Error(xhr.status +':'+ xhr.responseText));
        }
      } catch(err) {
        popError('Load resource'+ url +'fail', err);
      }
    }
  }
  
  
  function createRootModule(urlprefix, _base, _cdn_path) {
    return createModule(urlprefix, { 
      name : '[root-module]',
      exports: {},
      _cache: {},
      _base,
      _cdn_path,
    });
  }
  
  
  function createModule(urlprefix, _parent) {
    let mod = { 
      name      : '[unknow]',
      exports   : {},
      _cache    : _parent._cache,
      _base     : _parent._base,
      _cdn_path : _parent._cdn_path,
      require,
    };
    
    function getFullPath(name) {
      let absPath;
      if (name.startsWith(cdnpre)) {
        console.debug("require from cdn", name);
        absPath = '/web/' + name;
      }
      else if (name.startsWith("./") || name.startsWith('../')) {
        console.debug("relatively require", mod._base, '>',name);
        absPath = pathmod.join(mod._base, name);
      }
      else if (name[0] == '/') {
        console.debug("absolute require", name);
        absPath = name;
      }
      else {
        console.debug("direct require", name);
        absPath = name;
      }
      
      if (absPath[absPath.length-1] == '/') {
        absPath += 'index.js';
      }
      return absPath;
    }
    
    //
    // 全能 require, 规则:
    // 1. 如果以 'cdn/' 开头, 则使用 cjs 同步加载模块, 返回模块的导出
    // 2. 如果 name 存在于全局中, 则直接返回
    // 3. 以 './' 开头的文件以当前引入页面作为根目录, 同步加载模块.
    // 4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
    //
    function require(name, _use_promise, _use_promise_factory) {
      let rmod;
      let absPath = getFullPath(name);
      
      function process(ok, fail) {
        rmod = export_modules[name];
        if (rmod) {
          console.debug("require from export_modules", name);
          _pf_ok(rmod);
          return;
        }
        
        rmod = mod._cache[absPath];
        if (rmod) {
          console.debug("require from cache", name);
          _pf_ok(rmod);
          return;
        }
        
        loadModule(absPath, _pf_ok, fail, _use_promise || _use_promise_factory);
        return;
        
        function _pf_ok(mod) {
          ok(_return(name, mod))
        }
      }
      
      if (_use_promise_factory) {
        return function() {
          return new Promise(process);
        }
      }
      
      if (_use_promise) {
        return new Promise(process);
      }
      
      let _r;
      process((m)=>{ _r = m; }, (err)=>{ throw err; });
      return _r;
    }
    
    
    function _return(name, mod) {
      if (mod.exports && mod.exports.__esModule) {
        return mod.exports.default;
      }
      return mod.exports;
    }
    
    
    function loadModule(absPath, ok, fail, use_async) {
      _load_resource(urlprefix + absPath, null, use_async, function(err, code) {
        if (err) return fail(err);
        
        let wcode = '(function(module, require, exports) {'+
                      code +
                    '\n})';
        let fn;
        try {
          fn = eval(wcode);
        } catch(err) {
          let msg = ['Load', absPath, 'from', _parent.name, 'fail:', err.message];
          fail(new Error(msg.join(' ')));
          return;
        }
        let module = createModule(urlprefix, mod);
        module._base = pathmod.dirname(absPath);
        fn(module, module.require, module.exports);
        mod._cache[absPath] = module;
        mod.name = pathmod.basename(absPath);
        ok(module);
      });
    }
    
    return mod;
  }
})();