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
  const xv = window.xv = {};
  const xuiProtocol = 'xui://';
  // path 模块
  let pathmod;
  let devMode;
  
  // 导出到全局变量
  const export_global = {
    defineModule,
    loadCdn,
    popError,
    xAppState,
    cdn_path,
    withFileName,
    getFullPath,
  };
  
  const init_state = checkEnv();
  export_to_global(export_global);
  
  init_state.catch(function(err) {
    popError('Vue 应用引导错误', err);
  });
  
  
  function export_to_global(ex) {
    for (let name in ex) {
      if (window[name]) {
        console.warn("在导出 window."+ name, '时冲突');
        continue;
      }
      xv[name] = window[name] = ex[name];
    }
  }
  
  
  function xAppState() {
    return init_state;
  }
  
  
  function defineModule(name, module) {
    if (!name) throw new Error("must have name");
    if (!module) throw new Error("must have module on ["+ name +']');
    if (!module.exports) throw new Error("must have module.exports on ["+ name +']');
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
    let prefix = location.href.substr(0, location.href.lastIndexOf(fullPath));
    pathmod = lite_require(cdn_path +"path-browserify/1.0.1/index.js");
    
    let basePath = pathmod.dirname(fullPath);
    let rootModule = createRootModule(prefix, basePath, cdn_path);
    let vuever = parseInt(/([0-9]+)\..+/.exec(Vue.version));
      
    defineModule('path', {exports: pathmod});
    window._xboson_debug = devMode = basePath.startsWith("/t");
    
    export_to_global({
      require     : rootModule.require,
      debug       : devMode,
      url_prefix  : prefix,
      ctx_prefix  : prefix.substr(0, prefix.lastIndexOf('/face')),
      vuever,
    });
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
        customClass: 'vue-app-big-notify',
      });
    } 
    // Antd
    else if (window.antd && antd.notification) {
      antd.notification.error({
        message : title,
        description : err.message,
        style: {'word-break': 'break-all', 'white-space':'pre-wrap'},
      });
    } 
    else {
      makeDialog([
        "<div style='color:red; font-size:larger;'>", title, "</div>",
        "<div>", err.message, "</div>",
      ]);
    }
  }
  
  
  function withFileName(code, filename) {
    return code +'\n//@ sourceURL='+ filename;
  }
  
  
  function lite_require(s) {
    // let wcode = '(function(module, exports) {'+
    //               syncload(s) +
    //             '})';
    let mod = {exports:{}};
    // eval(wcode)(mod, mod.exports);
    new Function('module', 'exports', withFileName(syncload(s), s))(mod, mod.exports);
    return mod.exports;
  }
  
  
  function loadCdn(path, _not_run) {
    if (path.startsWith(cdnpre)) {
      path = path.substring(cdnpre.length);
    }
    let code = syncload(cdn_path + path);
    if (!_not_run) return code;
    
    try {
      // return new eval(code);
      return new Function(withFileName(code, path))();
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
        popError('Load resource '+ url +' fail', err);
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
    const mod = { 
      name      : '[unknow]',
      exports   : {},
      _cache    : _parent._cache,
      _base     : _parent._base,
      _cdn_path : _parent._cdn_path,
      require,
    };
    
    const fileLoaders = {
      '.vue'  : javascriptLoader,
      '.js'   : javascriptLoader,
      '.ts'   : javascriptLoader,
      '.css'  : styleLoader,
      '.less' : styleLoader,
      '.sass' : styleLoader,
      '.styl' : styleLoader,
      '.html' : htmlLoader,
      '.htm'  : htmlLoader,
      '.pug'  : htmlLoader,
    };
    
    //
    // 全能 require, 规则:
    // 1. 如果以 'cdn/' 开头, 则使用 cjs 同步加载模块, 返回模块的导出
    // 2. 如果 name 存在于全局中, 则直接返回
    // 3. 以 './' 开头的文件以当前引入页面作为根目录, 同步加载模块.
    // 4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
    //
    function require(name, _use_promise, _use_promise_factory, _donot_default) {
      let absPath = getFullPath(name, mod._base);
      let ext = pathmod.extname(absPath);
      let process = null;
      
      if (export_modules[name]) {
        console.debug("require from export_modules", name);
        process = cacheLoader(export_modules[name]);
      }
      else if (mod._cache[absPath]) {
        console.debug("require from cache", name);
        process = cacheLoader(mod._cache[absPath]);
      }
      else {
        let loader = fileLoaders[ext];
        if (! loader) {
          throw new Error("No loader can load files: "+ absPath);
        }
        console.debug("require from", ext, 'loader');
        let use_async = _use_promise || _use_promise_factory;
        process = loader(name, absPath, use_async, _donot_default);
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
    
    
    function check_es_module_exports(mod, _donot_default) {
      if ((!_donot_default) && mod.exports && mod.exports.__esModule) {
        return mod.exports.default;
      }
      return mod.exports;
    }
    
    
    function wrap_return_exports(ok, _donot_default) {
      return function wrap_ok(mod) {
        ok(check_es_module_exports(mod, _donot_default));
      }
    }
    
    
    function cacheLoader(mod, _donot_default) {
      return (ok, fail)=>{
        ok(check_es_module_exports(mod, _donot_default))
      }
    }
    
    
    function javascriptLoader(name, absPath, _async, _donot_default) {
      return (ok, fail)=>{
        let wok = wrap_return_exports(ok, _donot_default);
        loadModule(absPath, wok, fail, _async, _create_module);
        
        function _create_module(code, module) {
          // let wcode = '(function(module, require, exports, __dirname, __filename) {'+
          //               code +
          //             '\n})';
          let fn;
          try {
            // fn = eval(wcode);
            fn = new Function('module', 'require', 'exports', '__dirname', '__filename', 
                withFileName(code, absPath));
            // fn.name = absPath;
            fn(module, module.require, module.exports, module._base, module.name);
          } catch(err) {
            let msg = ['Load', absPath, 'from', _parent.name, 'fail:', err.message];
            throw new Error(msg.join(' '));
          }
        }
      }
    }
    
    
    function styleLoader(name, absPath, _async, _dd) {
      return (ok, fail)=>{
        let wok = wrap_return_exports(ok, _dd);
        
        // 异步模式用 <link> 加载, 不下载代码
        if (_async) {
          let el = document.createElement('link');
          el.setAttribute('rel', 'stylesheet');
          el.setAttribute('href', urlprefix + absPath);
          
          let module = createModule(urlprefix, mod);
          module._base = pathmod.dirname(absPath);
          module.name = pathmod.basename(absPath);
          _c_module(el, module).mount();
          return wok(module);
        }
        
        loadModule(absPath, wok, fail, _async, (code, module)=>{
          let el = makeCodeElement('style', code, 'style', absPath);
          _c_module(el, module).mount();
        });
        
        function _c_module(el, module) {
          return module.exports = {
            el,
            mount,
            unmount,
          };
          
          function mount() {
            document.head.append(el);
          }
          
          function unmount() {
            el.remove();
          }
        }
      }
    }
    
    
    function htmlLoader(name, absPath, _async, _dd) {
      return (ok, fail)=>{
        let wok = wrap_return_exports(ok, _dd);
        
        loadModule(absPath, wok, fail, _async, (code, module)=>{
          let el = makeCodeElement('div', code, 'html', absPath);
          let elements = toArray(el);
          
          module.exports = {
            el,
            elements,
            mount,
            unmount,
          };
          
          function mount(to) {
            if (!to.append) {
              throw new Error("Cannot mount to non-HTMLElement objects"); 
            }
            elements.forEach(e => to.append(e));
          }
          
          function unmount() {
            el.innerHTML = '';
            mount(el);
          }
          
          function toArray(el) {
            let elements = [];
            let next = el.firstChild;
            do {
              elements.push(next);
              next = next.nextSibling;
            } while(next);
            return elements;
          }
        });
      };
    }
    
    
    function makeCodeElement(tagName, code, loaderType, fullpath) {
      let el = document.createElement(tagName);
      el.innerHTML = code;
      el.className = 'vue-app-'+ loaderType +'-loader';
      el.setAttribute('path', fullpath);
      return el;
    }
    
    
    //
    // Function _module_creator(code, module)
    //  code   - 加载的代码
    //  module - 要初始化的模块
    //
    function loadModule(absPath, ok, fail, use_async, _module_creator) {
      _load_resource(urlprefix + absPath, null, use_async, function(err, code) {
        if (err) return fail(err);
        
        let module = createModule(urlprefix, mod);
        module._base = pathmod.dirname(absPath);
        module.name = pathmod.basename(absPath);
        
        try {
          _module_creator(code, module);
        } catch(err) {
          return fail(err);
        }
        
        mod._cache[absPath] = module;
        ok(module);
      });
    }
    return mod;
  }
  
  
  function makeDialog(content, waitTime) {
    let el = document.createElement("dialog");
    el.setAttribute('open', true);
    el.style.setProperty('--animate-duration', '.5s');
    el.className = 'animate__animated animate__fadeInDown';
    el.innerHTML = Array.isArray(content) ? content.join('') : content;
    Object.assign(el.style, {
      position      : 'absolute'  , top       : '20px',
      padding       : '20px 50px' , border    : 0,
      broderRadius  : '5px'       , boxShadow : '0 0 5px #777',
      minWidth      : '200px'     , 
    });
    
    let close = document.createElement("a");
    close.setAttribute('href', '#');
    close.innerHTML = "关闭";
    Object.assign(close.style, {
      color : 'blue', fontSize : 'smaller',
    });
    
    let doClose = ()=>{
      el.className = 'animate__animated animate__fadeOutUp';
      el.addEventListener('animationend', ()=>el.remove());
    };
    close.addEventListener('click', doClose);
    if (waitTime === undefined) setTimeout(doClose, 3000);
    else if (waitTime > 0) setTimeout(doClose, waitTime);
    
    let ct = document.createElement("div");
    Object.assign(ct.style, {
      textAlign : 'right', marginTop: '5px', borderTop: '1px solid #eee',
    });
    ct.append(close);
    
    el.append(ct);
    document.body.appendChild(el);
    return el;
  }
  
  
  function getFullPath(name, _base) {
    let absPath;
    if (name.startsWith(cdnpre)) {
      console.debug("require from cdn", name);
      absPath = '/web/' + name;
    }
    else if (name.startsWith("./") || name.startsWith('../')) {
      if (!_base) {
        throw new Error('相对路径必须设置 _base 参数');
      }
      console.debug("relatively require", _base, '>',name);
      absPath = pathmod.join(_base, name);
    }
    else if (name[0] == '/') {
      console.debug("absolute require", name);
      absPath = name;
    }
    else if (name.startsWith(xuiProtocol)) {
      console.debug("xui protocol require", name);
      absPath = pathmod.join(devMode ?'/t' :'/ui', name.substring(xuiProtocol.length));
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
  
})();