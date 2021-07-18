/* Create By xBoson System */
//
// 装载 bootstrap-vue 组件
//
let jquery = require('cdn/jquery/jquery-3.3.1.min.js');
xv.defineModule('jquery', {exports: jquery});

let popper = require("cdn/popper-core/2.9.2/popper.min.js", 0,0, 1);
xv.defineModule('popper.js', {exports: popper});

let portal = require("cdn/portal-vue/2.1.7/portal-vue.umd.min.js");
let boot   = require("cdn/bootstrap/4.6.0/bootstrap.min.js");
let bootv  = require("cdn/bootstrap-vue/2.21.2/bootstrap-vue.min.js");

// Vue.use(bootv);

let css = [
  require("cdn/bootstrap/4.6.0/bootstrap.min.css"),
  require("cdn/bootstrap-vue/2.21.2/bootstrap-vue.min.css"),
]

module.exports = {
  jquery, boot, bootv, portal, popper, css,
};