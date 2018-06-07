# XML 流式生成工具

帮助生成 xml 格式字符串, 使用流的方式输出, 减少内存占用;  
生成器程序必须严格按照 xml 的顺序编写.  
生成器的函数调用顺序也需要遵照说明, 数据在调用后将立即写入
输出流, 无法回退或取消.


# DEMO

```js
var xml = require("xml");
var stream = require("streamutil");
//
var buf = stream.openStringBufferOutputStream();
var build = xml.build(buf);
//
var a = build.tag('a');
var b = a.tag('b');
var c = b.tag('c');
var d = b.tag('d').attr("type", 'int');
//
build.end();
// 输出: <a><b><c/><d type="int"/></b></a>
var x = buf.toString();
console.log(x);
```


# API

引入

```js
var xmlbuild = require("xml");
```

## XmlRoot xmlbuild.build(JsOutputStream: out [, bool: pretty])

创建一个 xml 构造器对象, 返回 XmlRoot 的实例; 默认不会格式化输出.

参数:

* out 生成的 xml 字符串写入到输出流中, [JsOutputStream](docs/api-streamutil.md) 
* pretty 格式化输出, 默认 false.


## TagStruct xmlbuild.parse(JsInputStream: input)

解析输入流中的字符串, 返回解析后的 xml 结构对象 TagStruct.

参数:

* input 输入流 [JsInputStream](docs/api-streamutil.md) 


```js
// 返回结构例子
[
  {
    "name": "getCountryCityByIpResult",
    "qName": "getCountryCityByIpResult",
    "text": "",
    "uri": "http://WebXml.com.cn/"
    "attributes": {},
    "childrenNode": [
      {
        "attributes": {},
        "childrenNode": [],
        "name": "string",
        "qName": "string",
        "text": "182.201.178.62",
        "uri": "http://WebXml.com.cn/"
      },
      {
        "attributes": {},
        "childrenNode": [],
        "name": "string",
        "qName": "string",
        "text": "辽宁电信",
        "uri": "http://WebXml.com.cn/"
      }
    ],
  }
],
```


## void stringify(TagStruct: ts, JsOutputStream: out)

把 xml 结构数据以 xml 字符串输出到 out 流中.


## String stringify(TagStruct: ts)

将 xml 结构数据转换为 xml 字符串并返回.


# class XmlRoot

根对象, 用于创建 xml 标签, 本身并不输出 xml 内容.

## writeHead()

写出 xml 头, 必须最先调用, 否则抛出异常.


## end()

结束所有 xml 输出, 并清空缓冲区, 之后对该对象的调用都会抛出异常.


## XmlTagWriter tag(string: name)

创建并返回 XmlTagWriter 类的实例.


# class XmlTagWriter

xml 字符串输出类.


## attr(string: name, object: value)

输出标签属性, 不检查标签的重复, value 中不可有引号, 
必须在输出标签体之前, 或创建子标签之前调用, 否则抛出异常.


## text(object: txt)

将 txt 输出到标签体中, 必要时做 xml 转义, 保证 txt 转换为纯文本.


## xml(object: txt)

将 txt 原样输出到标签体中, 不做转换.


## XmlTagWriter tag(string: name)

创建子标签并返回 XmlTagWriter 类的实例.


## end()

关闭标签; 通常不需要显式调用, 当新的标签被创建, 前一个标签会自动关闭.


# class TagStruct

xml 结构类, 表示解析后的 xml 对象.


## String: name

标签名称, 不含有名字空间前缀


## String: qName

带有名字空间前缀的标签名称


## String: uri

如果在名字空间中, 该属性为名字空间 URI, 否则为空.


## String: text

标签体中的纯文本


## TagStruct: parent

指向父节点


## Array<TagStruct>: childrenNode

指向子节点


## Map<String, String>: attributes

属性表