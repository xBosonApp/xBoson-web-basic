# SYS 模块

全局模块, 在脚本中立即可用.


## 可用属性

### sys.request

获取 HTTP 请求参数.

```javascript
// 获取 http 请求参数 name 的值
var name = sys.request.name;
```

### sys.requestParameterMap

获取 HTTP 请求参数的数组, 由 HTTP 多个同名参数组成的数组.

```javascript
// 总是返回数组
var values = sys.requestParameterMap.checkbox_values; 
```


### sys.requestJson

该方法在 2.0 中废弃.


## 可用 API


### sys.addRetData(object:Value [, string:KeyName])

绑定数据到应答数据集, 应答数据集是当前 Api 请求上下文的隐含数据集, 由系统维护, 仅在当前请求上下文中有效.

参数:

* Value: 数据
* KeyName: [可选] 绑定到数据集的变量名称, 若省略该参数变量名使用 'result'.

```javascript
var list1 = {1,2,3};
sys.addRetData(list1, "list1");
```


### sys.setRetData(int:Code [, string:Message, string...:KeyNames])

设置应答数据, 并从应答数据集中选择数据返回, 若在脚本中从未调用该方法, Api 将应答给客户端代码 999.

参数:

* Code: 返回码
* Message: [可选] 返回消息, 未设置则在已定义的返回码映射中选择对应的消息字符串.
* KeyNames: [可选] 从应答数据集中选择返回值, 这些值将应答给客户端

```javascript
// 设置返回数据, 并从应答数据集中选择 "list1" 返回给客户端.
sys.setRetData(0, "OK", "list1");
```