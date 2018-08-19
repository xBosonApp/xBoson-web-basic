# 脚本组件

这些组件没有显示, 提供一些常用的 js 功能.


## `<js:default>`

设置变量默认值, 这个变量是模板环境, 与客户端无关

必填参数:
  
* name: 变量名, 
* dval: 默认值, 
 
可选参数:
  
* rand: 随机生成不重复的id值给 name 变量, 
* prefix: 随机生成变量时使用前缀, 

```html
<!-- 检查模板环境变量 width, 如果未设置, 则设置默认值 3 -->
<js:default name='width' dval='3' />
<!-- 如果环境变量 id 不存在, 生成不重复的 id 值, 最终 id='flow_diagram_999' -->
<js:default name='id' rand='true' prefix='flow_diagram_'/>
```


## `<js:global>`

在模板环境, 对全局变量进行操作, 每个标签都有自己的局部上下文, 
标签和标签之间不能传送数据, 通过该方法来实现标签间通信.  
`to/from/clear/set` 参数只能选择一个进行操作.
  
参数:

* name: 全局变量名, 
* to: 全局变量值设置到局部变量中, 
* from: 局部变量设置到全局变量, 
* clear: 清除全局变量, 
* set: 直接设置一个值
 

## `<js:xboson>`

在页面上加载 xboson.js 脚本

```html
<js:xboson/>
```


## `<js:jquery>`

在页面上加载 jquery 脚本, 版本为: jquery-2.0.3.min.  
[中文参考](http://hemin.cn/jq/), [官方文档](https://api.jquery.com/)

```html
<js:jquery/>
```


## `<js:canvg>`

加载脚本, 用于将 svg 文本渲染到 canvas 上, [参考](https://github.com/canvg/canvg).

```html
<js:canvg/>
```


## `<js:html2canvas>`

加载脚本, 用于将页面渲染到 canvas 上, [参考](https://github.com/niklasvh/html2canvas)

```html
<js:html2canvas/>
<js:canvg/>
<script>
// 设定渲染目标
var render_target = document.body;
var options = {
  useCORS: false,
  allowTaint: true,
  ignoreClear: true, 
  ignoreDimensions: true,
  ignoreMouse: true,
};
// 将页面和页面中的 svg 都渲染到 canvas 上, (可能会有错误)
html2canvas(render_target, options).then(function(canvas) {
  $(render_target).find("svg").each(function() {
    canvg(canvas, this.outerHTML, options);
  });
  // 下载
  var a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = id.replace('/', '-') + '.png';
  a.click();
});
</script>
```