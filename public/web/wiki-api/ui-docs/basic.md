# 引擎前端

引擎从文件系统读取文件, 并对特殊扩展名的文件进行渲染,
html 文件在引用这些渲染文件时, 必须注意正确的类型,   

如: '.less' 文件实际渲染为 css 样式表, 前端用普通的 css 引入语法.  
部分前端渲染文件在导入时, 需要使用垫片, 这些垫片见后文.

返回给浏览器 http 头域中附加 `Full-Path` 属性, 表示 ui-fs 上的绝对路径.

需要注意的是, 这些文件中如果出现语法错误, 渲染器会渲染错误消息,
开发时应经常检查渲染结果是否正确.




## `.htm` 模板

带有逻辑的 html 模板, 渲染为 html 文件, 浏览器可直接访问.  
其他说明文档未特别说明, 则是模板的模块定义.


## `.ts`

TypeScript 语言文件, 渲染为 javascript 前端文件.

[带有强制类型的 javascript 语言](https://www.typescriptlang.org/)


## `.jsx .tsx`

一种 javascript 变体, 可在脚本逻辑中内嵌 xml 文档, 与 React 前端库配合使用.  
渲染为 javascript 前端文件, 必须引入 react-app 垫片.

[JSX简介](https://reactjs.org/docs/introducing-jsx.html)


## `.es5`

文件内容为 javascript 语言, 可以使用最新 ES 语法;   
渲染为旧的 es5 javascript 前端文件;


## `.less`

Less（代表Leaner样式表）是CSS的向后兼容语言扩展. 渲染为 css 文件, 前端 html 可直接引用,  
支持 `@import` 引入其他 less 文件.

[Leaner样式表](https://lesscss.org/)


## `.sass`

另一种 css 扩展. 渲染为 css 文件, 前端 html 可直接引用,  
不支持 `@import` 引入另一个 sass 文件(内嵌渲染).

[文档](https://www.sass.hk/)


## `.styl`

富有表现力，动态 css 扩展, 渲染为 css 文件, 前端 html 可直接引用,  
不支持 `@import` 引入另一个 styl 文件(内嵌渲染).

[富有表现力，动态，强大的CSS](https://stylus-lang.com/)


## `.pug`

一种前端模板, 渲染为 html 文件, 浏览器可直接访问.  
不支持 `include` 命令.

[语言参考](https://pugjs.org/language/attributes.html)


## `.vue`

Vue 单文件组件, 渲染为 javascript 文件, 其中包含 Vue 组件的定义,  
必须使用 [vue-app 垫片](ui-docs/vue-app.md).

[单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)  
[组件基础](https://cn.vuejs.org/v2/guide/components.html)


## 浏览器缓存策略

平台的 UI 引擎应用如下的缓存策略来保证前端的最佳网络性能:

用户打开浏览器第一次访问的资源将被检查修改时间, 并返回内容(200)或未改动(304),  
此后 `max-age` 时间内都使用浏览器缓存中的资源, 并在 `max-age` 之后重新访问服务器获取状态;

开发人员需要频繁修改/访问资源, 应该开启浏览器调试模式, 并启用浏览器的 'Disable cache' 开关.