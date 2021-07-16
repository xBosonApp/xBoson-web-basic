/* Create By xBoson System */
let VueCompositionAPI = require("cdn/composition-api/1.0.0/vue-composition-api.prod.js", 0,0,1);
window.defineModule('@vue/composition-api', { exports: VueCompositionAPI });

let VueDemi = (function() {
  let VueDemi = {};
  for (var key in VueCompositionAPI) {
    VueDemi[key] = VueCompositionAPI[key]
  }
  VueDemi.isVue2 = true
  VueDemi.isVue3 = false
  VueDemi.install = function (){}
  VueDemi.Vue = Vue
  VueDemi.Vue2 = Vue
  VueDemi.version = Vue.version
  return VueDemi;
})();
window.defineModule('vue-demi', { exports: VueDemi });
window.VueDemi = VueDemi;

let echarts = require("cdn/echarts/5.1.1/echarts.min.js", 0,0,1);
window.defineModule('echarts', { exports: echarts });
window.defineModule('echarts/core', { exports: echarts });

let vecharts = require("cdn/vue-echarts/6.0.0/index.umd.js", 0,0,1);
Vue.component('v-chart', vecharts);

module.exports = {
  VueCompositionAPI, echarts, vecharts,
};