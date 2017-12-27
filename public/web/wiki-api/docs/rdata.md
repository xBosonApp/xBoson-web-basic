# 平台接口返回数据

平台默认返回 json 数据格式, 通过增加 http 参数 '$format' 来指定其他的数据格式.


## JSON (默认格式)

当请求参数没有定义 '$format' 或是 '$format=json' 则返回这种格式.

返回数据中, code 和 msg 是固定的, code 指明该接口返回的消息码, 
msg 保存该消息码对应的字符串消息, 或接口自定义的字符串消息, 该消息是可读的.
data / data2 / result 是接口返回数据, 这个名称由接口定义, 
data / result 是常用名词, 其数据类型也由接口来定义.


```json
{
  "code": 0,
  "msg": "some message",
  "data": [],
  "data2" : [],
  "result" : {},
}
```

*返回的数据中并没有换行等格式化样式, 仅是单行字符串, 这里仅是演示.*


## JSONP

当请求参数定义了 '$format=jsonp&cb=function_name' 则返回这种格式.

cb 参数指明生成的回调函数名称, 如果未提供参数 'cb' 则该参数将使用默认值 'cb' 通常这会引起 jsonp 冲突, 不要这样做.

jsonp 格式允许跨域请求数据.


```javascript
function_name({
  "code": 0,
  "msg": "some message",
  "data": [],
})
```


## XML

当请求参数定义了 '$format=xml' 则返回这种格式.
数据字段顺序不是明确定义的, 根节点一定是 'response-root', 其他节点根据版本可能不同.

code 节点一定是整数类型, msg 节点一定是字符串类型, 其他节点名称和类型由接口定义.

### 节点数据类型

节点数据类型由 'type' 属性定义.

##### array 类型

声明一个数组, 必须有数组长度属性 'length', 子节点名称一定是 'element' 表示数组的一个元素, 'index' 属性为元素在数组中的索引.

##### object 类型

对象类型, 这种类型对应 js 中的 object, 这种数据属性是动态的, 子节点名称就是属性名称, 每个子节点都有自己的类型

##### bool 类型

布尔值, true 或 false

##### string 类型

字符串

##### number 类型

可以是整数或浮点数


```xml
<?xml version="1.0" encoding="UTF-8" ?>
<response-root xboson="2.03">
  <code>0</code>
  <msg>OK</msg>
  <result xboson="2.03" type="array" length="154">
    <element index="0" type="object">
      <typecd type="string">DE</typecd>
      <typenm type="string">数据元</typenm>
      <status type="bool">true</status>
      <version type="string">v1.0</version>
      <isParent type="bool">true</isParent>
      <optype type="number">1</optype>
    </element>
    <element index="1" type="object">
      ...
    </element>
  </result>
</response-root>
```