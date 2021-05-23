# 平台 vue 组件库

必须在 mas(.htm) 模板文件中, 引入:

```html
<vue:app>
  .... 引入其他 vue 组件
  <vue:xboson/>
</vue:app>
```

其中 `<vue:xboson/>` 是引入组件库, 该库必须在 xboson vue app 上下文中可用, 否则抛出异常消息.


# 可用组件

这些组件在使用时动态加载


## `<x-menu2>`

二级菜单组件

```vue 
<x-menu2 @openSubMenu='openSubMenu' :hideAll='hideAllMenu' title='一级菜单标题'>
  <template v-slot:main>
    <el-menu-item index='element'>一级菜单</el-menu-item>
  </template>
  <template v-slot:sub>
    二级菜单
  </template>
</x-menu2>
```

当一级菜单被选中后, @openSubMenu : Function(index) 消息绑定的方法被调用, 第一个参数是菜单项的 index 属性值;
绑定当前组件的数据到 :hideAll 属性上, 当变量改变, 菜单被隐藏;

该组件只负责菜单框架和动画, 菜单如何显示交给调用者处理.