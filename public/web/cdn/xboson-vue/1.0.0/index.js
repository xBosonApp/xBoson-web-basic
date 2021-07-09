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
  'x-ace',
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


const base = '/web/cdn/xboson-vue/1.0.0/';

function reg(name) {
  Vue.component(name, require(base + name +'.vue', 1, 1));
}

window.xAppState().then(function() {
  componentNames.forEach(reg);
});

const xbosonPlugin = { install };
Vue.use(xbosonPlugin, {});


function install(vue, opt) {
  Vue.xapi = Vue.prototype.$xapi = pluginXapi;
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
          if (xv.debug && ret.data) {
            msg += '\n\n[DEBUG] '+ ret.data;
          }
          fail(new Error(msg));
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