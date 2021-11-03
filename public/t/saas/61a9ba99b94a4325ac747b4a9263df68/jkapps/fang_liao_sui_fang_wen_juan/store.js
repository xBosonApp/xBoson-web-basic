<!-- Create By xBoson System -->
<!-- http://xboson.net -->
<!-- Wed Aug 25 2021 13:20:44 GMT+0800 (CST) -->

//
// Vuex 初始化选项, 该文件需要手工编辑
//
module.exports = {
  // Vuex store 实例的根 state 对象
  state: {},
  
  // 在 store 上注册 mutation，处理函数总是接受 state 作为第一个参数
  // payload 作为第二个参数
  mutations: {},
  
  // 在 store 上注册 action。处理函数总是接受 context 作为第一个参数，
  // payload 作为第二个参数
  actions: {},
  
  // 在 store 上注册 getter，getter 方法接受以下参数：
  // state,     // 如果在模块中定义则为模块的局部状态
  // getters,   // 等同于 store.getters
  getters: {},
  
  // 包含了子模块的对象，会被合并到 store
  // 如果希望你的模块具有更高的封装度和复用性，
  // 你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  modules: {},
  
  // 一个数组，包含应用在 store 上的插件方法。
  plugins: [],
  
  // 为某个特定的 Vuex 实例打开或关闭 devtools
  // devtools : true,
}