# 平台 vue 组件库

必须在 mas(.htm) 模板文件中, 引入:

```html
<vue:app>
  .... 引入其他 vue 组件
  <vue:xboson/>
</vue:app>
```

其中 `<vue:xboson/>` 是引入组件库, 该库必须在 xboson vue app 上下文中可用, 否则抛出异常消息.


# Vue 可用组件

这些组件在使用时动态加载; 以下为 Vue 组件, 不可在 mas(.htm) 模板中使用.


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


## `<x-api>`

调用平台接口

```vue
<x-api 
  org='a297dfacd7a84eab9656675f61750078'
  app='19cb7c3b79e949b88a9c76396854c2b1'
  mod='prjmgr' 
  api='api' 
  :params='createParams'
  :immediately='false'
  :flag='f1'
  @success='createSuccess'  
  @error='error'/>
```

参数:
* org 机构id
* app 应用id
* mod 模块id
* api 接口id
* params HTTP 参数对象
* immediately 在页面加载后立即请求api, 默认 true
* flag 指向任意变量, 当变量改变时请求 api 

事件:
* success(retData{msg, code, ...}) 接口成功返回 
* error(Error) 接口调用失败


## `<x-agreement>`

显示用户协议

参数:
* visible 是否显示

事件:
* ok 点击 ‘理解并接受’ 按钮后触发


## `<x-login-form>`

登陆表单

事件:
* loginSuccess 登陆成功后发出.


## `<x-login-page>`

默认登陆页面, 与框架配合使用, 在需要登陆时自动显示.


## `<x-ace>`

显示一个代码编辑器

参数:
* v-model 绑定数据 
* language 代码的解析语言, 'javascript' 等, 默认 'text'
* theme 样式

事件:
* editHandle : (editor) 在组件加载后立即发出, 传递一个 ace.editor 实例.


## `<x-null>`

空组件, 什么也不做.


# Vue 插件 

绑定到 Vue 实例上的方法 / 属性


## Promise $xapi(url, params)

调用平台接口, url 需自行补全路径, 对返回按平台约定进行格式化.
在必要时发出登陆请求.


## $globalBus

全局消息对象, 除非特别约定, 组件不应该依赖任何全局事件来传递参数.
滥用全局事件会导致组件不可复用.