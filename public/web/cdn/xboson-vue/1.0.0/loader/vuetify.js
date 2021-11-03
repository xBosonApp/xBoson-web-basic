/* Create By xBoson System */
var Vuetify = require("cdn/vuetify/2.5.0/vuetify.min.js");
var css = require("cdn/vuetify/2.5.0/vuetify.min.css");

Vue.use(Vuetify);

let defaultInstance = new Vuetify({
  theme: { dark: false },
});
// 混入一个默认配置
Vue.mixin({
  vuetify : defaultInstance,
});

module.exports = { css, Vuetify, defaultInstance };