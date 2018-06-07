# Web Service

该模块需要授权后使用


# API

引入:

```js
var ws = require("ws");
```


## ws.save(Object: serviceSetting)

保存服务调用信息到 webservice 数据源中.


## ws.connection(String: soapKey)

从 webservice 数据源打开 soapKey 指定的服务配置, 并返回 WSConnection 对象.


## ws.wsdl(String: url)

读取 url 指向的远程 wsdl 资源, 返回解析后的数据.


## ws.wsdl(String: url, String: text)

读取 text 中保存的 wsdl 文本, 返回解析后的数据.


# class WSConnection

用于调用远程服务


## setVersion(int: version)

设置 soap 版本, 可选的: 10, 11, 12; 默认为 12;
该方法必须在 connect() 连接前调用, 否则抛出异常.


## connect()

打开到远程的连接, 此时 xml 消息尚未发送.
返回 [JsOutputStream](docs/api-streamutil.md) 对象.


## buildFunctionCall()

开始构建 xml 请求, 并返回 [XmlTagWriter](docs/api-xml.md).
用户需要使用返回的 xml 标签构建器构建请求参数, 
或使用 connect 方法返回的输出流构建非 xml 请求参数.


## openInput()

打开输入流用于读取服务接口的应答数据.
该方法一旦调用将关闭输出流, 应该在请求数据构建完成后调用.
返回 [JsInputStream](docs/api-streamutil.md) 对象.


## end()

openInput() 方法中会自动调用 end(); 该方法一般不需要调用.
将请求 xml 闭合, 同时清空输出流的缓冲区.