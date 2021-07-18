# 第三方库


通常完整前端应用程序会组合使用多个组件, 组件必须在应用引导页 `index.htm` 中引入.

```html
<!-- index.htm -->
<vue:app>
  <vue:element/>
  .... 插入一些 css 代码, 或引入非 vue js 库 等 ....
</vue:app>
```

除非必要, UI 组件推荐使用 require() 方法引入 `cdn/xboson-vue/1.0.0/loader/` 目录中对应的组件加载器.


## `<vue:vue>`

引入 [Vue 2.6.11 基础库](https://cn.vuejs.org/v2/guide/index.html)

## `<vue:resource>`

引入 [资源加载库 1.5.2](https://github.com/pagekit/vue-resource/blob/develop/docs/api.md), 用于远程(ajax)资源加载

## `<vue:router>`

引入 [vue 路由库 3.5.1](https://router.vuejs.org/zh/guide/)

## `<vue:vuex>`

引入 [状态管理模式库 3.6.2](https://vuex.vuejs.org/)

## `<vue:xboson>`

引入 [平台组件库](ui-docs/xboson-vue.md)

## `<vue:element>`

引入 [Elemenu UI 2.15.1](https://element.eleme.io/#/zh-CN) 前端框架库

## `<vue:antd>`

引入 [Ant Design 1.7.5](https://www.antdv.com/docs/vue/introduce-cn/) 的 Vue 实现，开发和服务于企业级后台产品。

## `<vue:bootstrap>`

引入 [BootstrapVue 2.21.2](https://bootstrap-vue.org/docs)

## `<vue:echarts`>

引入 [Echarts 5.1.1](https://echarts.apache.org/zh/tutorial.html) 的 [vue-echarts 6](https://github.com/ecomfe/vue-echarts) 组件.

如需渲染 3d 图表, 需要额外引入 `<js:echarts-gl/>`

## `<vue:composition-api>`

引入 [vue2 的兼容层 1.0.0](https://github.com/vuejs/composition-api), 从而支持部分 vue3 api, 可引入 vue3 的组件.


## `<vue:data-view>`

引入 [数据大屏 2.10.0](https://github.com/DataV-Team/DataV) 组件


## `<vue:draggable>`

引入[拖拽 2.24.3](https://github.com/SortableJS/Vue.Draggable)组件

## `<vue:color>`

引入颜色[选择器 2.8.1](https://github.com/xiaokaike/vue-color)


## `<vue:fullcalendar>`

引入[日历组件 5.8.0](https://fullcalendar.io/)