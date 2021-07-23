# 平台 vue 组件库

必须在 mas(.htm) 模板文件中, 引入:

```html
<vue:app>
  .... 引入其他 vue 组件
  <vue:xboson/>
</vue:app>
```

其中 `<vue:xboson/>` 是引入组件库, 该库必须在 xboson vue app 上下文中可用, 否则抛出异常消息.

[vue:xboson 组件库说明](ui-docs/web/cdn/xboson-vue)