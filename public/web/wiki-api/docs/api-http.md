# Http 客户端模块

全局模块, 在脚本中立即可用.

http 基于当前请求上下文.


# API

## http.setStatusCode(int:code)

设定当前请求的响应状态码

## http.schema()

获取当前请求的 Schema

## http.domain()

获取当前请求的 Domain

## http.port()

获取当前请求的端口

## http.remoteIp()

获取当前请求的客户端 IP 地址

## http.method()

获取请求 Method: GET/POST/DEL/HEADER

## http.headers()

获取所有请求头信息

```javascript
var headers = http.headers();
var headerValue = headers["Content-Type"];
```

## http.uri()

获取请求URI

## http.getCookie(string:CookieName)

获取 Cookie 值

## http.setCookie(string:Name, string:Value [, int:MaxAge, string:Path])

参数:

* Name: 名
* Value: 值
* MaxAge: 在客户端的有效时间, 单位秒; 默认 900 秒
* Path: cookie 的有效范围, 默认 '/'


## http.encode(string:val [, string:charset])

编码 url 值组件, 默认 charset 为 utf8

## http.decode(string:val [, string:charset])

解码 url 值组件, 默认 charset 为 utf8


## Response http.platformGet(object:ApiInfo [, object:Param, object:header])

调用 api, 2.0 平台实现内部直接调用.

Response.data 总是调用 api 返回的对象.

参数:

* ApiInfo: 在PASS平台中: { app: 应用id, mod: 模块id, api: 接口id, org: 机构 id }; 在边缘运算节点中, 该参数为接口路径字符串, 例: `/xedge/public/api/user-state`
* Param: http 请求参数
* header: 请求头

```javascript
var ret = http.platformGet(
    {app:"appid123",mod:"moduleid123",api:"apiname123"},
    {paramKey: 123});
// HTTP 响应状态码
var statusCode = ret["code"];
// 被调用的 API 返回的 Cookie JSON Map 对象
var cookie = ret["cookie"];
// 被调用的 API 返回的数据，JSON 结构	
var retData = ret["data"];
// 被调用的 API 返回的 "xxx" 的值
retData["xxx"];
```


## Response http.platformPost(object:ApiInfo [, object:bodyParm, object:Param, object:header])

该方法与 http.platformGet 意义相同, 由于是内部调用, 并不区分 post/get, body 参数将与 url 参数合并调用 api.

Response.data 总是调用 api 返回的对象.


## http.setTimeout(int:second)

设置 http 调用远程 web 服务器的超时时间 (秒), 如果设置为 0 则永不超时, 默认为 10 (秒).

必须在调用 get/post 方法之前调用该方法修改超时, 否则无效.
必要时, 每个调用远程 web 服务的接口都需要调用该方法修改超时值.


## http.get(string:URL [, object:HttpParm, string:RetType, object:Header])

调用外部 api.

参数:

* URL: 完整路径
* HttpParm: http 请求参数
* RetType: 返回类型, 'string' 或 'json', 决定 Response.data 的数据解析方法.
* Header: 请求头

```javascript
var ret = http.get("http://beidu.con/api", { cityp: 'dl' }, "json");
// HTTP 响应状态码
var statusCode = ret["code"];  
// 被调用的 API 返回的 Cookie JSON Map 对象
var cookie = ret["cookie"];
// 被调用的 API 返回的数据，JSON 结构, data 中也可能保存 string, 视 RetType 参数而定.
var retData = ret["data"];
retData["xxx"];
```


## http.post(string:URL [, object:BodyParm, object:HttpParm, string:RetType, object:Header])

调用外部 api. 返回值定义与 http.get 相同.

参数:

* URL: 完整路径
* BodyParm: body 参数
* HttpParm: url 参数
* RetType: 返回类型, 'string' 或 'json', 决定 Response.data 的数据解析方法.
* Header: 请求头


## http.asyncPlatformGet(..), http.asyncPlatformPost(..)

废弃, 不支持异步调用.


# class Response

http 应答对象

## code

http 响应状态码, 404: 找不到, 200: 成功, 500: 服务器错误等.

## cookie 

object 类型, http 协议中 `Set-Cookie` 解析后的 k-v 对象.

## header

object 类型, http 中的所有头域.

## data

由请求时的 `RetType` 参数决定该字段的类型, 这是 http 应答 body 中的数据.