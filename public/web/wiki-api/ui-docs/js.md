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

## `<js:echarts>`

加载 echart 相关脚本. echart 版本 4.2.0-rc2;

* [官方配置文档](http://echarts.baidu.com/option.html#title)  
* [官方演示](http://echarts.baidu.com/examples/)
* [官方表格工具](http://www.echartsjs.com/spreadsheet.html)

```html
<js:echarts/>
<ui:grid id='req_log_chart' class='year' title='$NAME 报表'>
  <div class='chart_container'>
    <section class='autoChart chart2' id='CHART1' title='$TITLE' 
        url='/$APPID/$MODID/$APIID'>
    <section class='autoTxt chart2' id='TXT1'>
      <span>ITEM1:</span> <b name='val1'></b><br/>
      <span>ITEM2:</span> <b name='val2'></b>
    </section>
  </div>
</ui:grid>
<script>
  xb.buildChart('#CHART1', {}, function() { return { id:1 }; });
  xb.bingValueForName('#TXT1', function() { return { id:2 }; });
</script>
```

### API

这些 api 随着 echarts 标签一起引入.

#### xb.buildChart(dom_select, data, requestArgGetter);

创建 echart 图表, dom_select 选择器字符串选择一个 dom 对象, 并
把对象转换成图表, 该dom 必须有属性:

1. title 图表的标题,
2. url 图表加载数据的数据服务 url, 
    
data 参数指定默认图表参数, 首先调用 requestArgGetter() 函数并把
返回值作为调用数据服务的参数.  
数据服务返回的 json option 属性(或本身)即为 echart 的加载数据.
当图表元素被点击, 发出 'chart-click' 事件.


#### xb.bingValueForName(dom_select, requestArgGetter);

从 dom 的 url 属性加载接口数据, 将数据绑定到含有 name 属性的子元素  
接口数据的 key 对应 name, 值设置到 innerText.


#### xb.buildTable(data, head, _order);

data 数据转换为 html 表格, 并返回这个 jquery 对象, head 为表格头;  
data 是个数组, 元素为kv对象, 其中k是列名, v是数据.  
head 是个kv对象, k是数据列属性名, v是显示在表格中的名字.  
_order 可选项, 是个数组元素是数据列名, 决定表格列顺序.


#### xb.apiCached(url, arg, over);

该接口带有缓存, 缓存时间 1分钟, 调试模式忽略缓存.


#### xb.createCache(key, getNoCache, cache_time)

创建本地缓存, key 缓存主键, 
getFromLocal(cb: Function(err, data)) 该方法总是通过cb返回(远程)实时数据;  
如果处于 debug 模式, 则忽略缓存; cache_time 可以设置一个缓存有效时间, 毫秒.

返回: { 
    PREFIX : String 本地缓存前缀
    TIME   : Int 本地缓存时间, 毫秒, 只读
    get    : Function(cb: Function(err, data)) 获取 key 对应的数据 cb 会被回调.
}