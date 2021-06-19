//
// xBoson Vue app bootloader
// Copyright (c) 上海竹呗信息技术有限公司
// https://xboson.net
//
(function() {
  
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

//
// xboson vue 注册组件列表
//
const componentNames = [
  'x-menu2',
  'x-api',
];


function reg(name) {
  Vue.component(name, require(base + name +'.vue', 1, 1));
}

window.xAppState().then(function() {
  componentNames.forEach(reg);
});

})();