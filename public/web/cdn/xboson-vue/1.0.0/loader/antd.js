/* Create By xBoson System */

// 全局加载过则使用全局对象, 低代码在重复加载时会重置组件状态
if (window.antd) {
  module.exports = {
    antd   : window.antd,
    moment : window.moment,
    css    : null,
  };
  return;
}
//
// 装载 Ant design 组件
//
let moment = require('cdn/moment/2.29.1/moment-with-locales.min.js');
xv.defineModule('moment', { exports: moment });

let antd = require('cdn/ant-design-vue/1.7.5/antd-with-locales.min.js', 0,0,1);
Vue.use(antd);

let css = require('cdn/ant-design-vue/1.7.5/antd.min.css');

module.exports = {
  moment, antd, css,
};