//
// xBoson Vue app bootloader
// Copyright (c) 上海竹呗信息技术有限公司
// https://xboson.net
//
(function() {
  
//
// xboson vue 注册组件列表
//
const componentNames = [
  'x-menu2',
  'x-api',
  'x-api-comm',
  'x-ace',
  'x-agreement',
  'x-login-form',
  'x-login-page',
  'x-null',
  'x-selector-api',
  'x-selector-dict',
  'x-selector-dict-content',
];

if (!window.Vue) {
  const msg = "错误: 未安装 Vue 到环境";
  alert(msg);
  throw new Error(msg);
}

if (!window.xAppState) {
  const msg = '错误: 不在 vue app 上下文中';
  alert(msg);
  throw new Error(msg);
}


class EventBus {
  constructor() {
    this._bus = new Vue();
  }
  
  emit(name, ...parm) {
    this._bus.$emit(name, ...parm);
  }
  
  send(...parm) {
    this._bus.$emit(name, ...parm);
  }
  
  on(name, listener) {
    this._bus.$on(name, listener);
    return this._makeremove(name, listener);
  }
  
  off(name, listener) {
    this._bus.$off(name, listener);
  }
  
  once(name, listener) {
    this._bus.$once(name, listener);
    return this._makeremove(name, listener);
  }
  
  _makeremove(n, l) {
    let remove = ()=>{
      this._bus.$off(n, l);
    }
    return {
      remove,
    }
  }
}


const globalBus = new EventBus();
const base = '/web/cdn/xboson-vue/1.0.0/';

function reg(name) {
  Vue.component(name, require(base + name +'.vue', 1, 1));
}

window.xAppState().then(function() {
  componentNames.forEach(reg);
});


Vue.use({ install }, {});


function install(vue, opt) {
  Vue.xapi = Vue.prototype.$xapi = pluginXapi;
  Vue.prototype.$globalBus = globalBus;
  Vue.directive('components-loader', { bind: dirComponentsLoader });
}


function dirComponentsLoader(el, binding, vnode) {
  // console.log(el, binding.value, '?', vnode)
  if (vnode.componentInstance) {
    // Object.assign(vnode.componentOptions.Ctor.options.components, binding.value);
    vnode.componentInstance.$options.components = 
        Object.assign(vnode.componentInstance.$options.components, binding.value);
  } else {
    console.warn("Fail components-loader", binding.value, vnode);
  }
}


function pluginXapi(url, params) {
  return new Promise((ok, fail)=>{
    if (!url) return fail(new Error("must hava url parameter"));
    if (!params) params = {};
    
    let config = {
      emulateJSON : true,
    };
    
    if (window.xv.debug) {
      params.s = 'd';
    }
    
    Vue.http.post(url, params, config).then(resp => {
      resp.json().then(ret=>{
        if (ret.code) {
          let msg = ret.msg;
          
          if (ret.code == 1000) {
            globalBus.emit('x-login', ret.code, ret.msg);
            return; // 不调用任何应答
          }
          else if (xv.debug && ret.data) {
            msg += '\n\n[DEBUG] '+ ret.data;
          }
          
          fail(Object.assign(new Error(msg), ret));
          return;
        }  
        
        ok(ret);  
      }, err => {
        fail(err);
      });
    }).catch(resp => {
      fail(new Error(resp.statusText));
    });
  });
}

})();