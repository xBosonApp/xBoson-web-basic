# Http 客户端模块

全局模块, 在脚本中立即可用.

http 基于当前请求上下文.


# 属性

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


## http.platformGet(object:ApiInfo [, object:Param, object:header])

调用 api, 2.0 平台实现内部直接调用.

参数:

* ApiInfo: { app: 应用id, mod: 模块id, api: 接口id, org: 机构 id }
* Param: http 请求参数
* header: 请求头

```javascript
var ret = http.platformGet(
    {app:"appid123",mod:"moduleid123",api:"apiname123"}, 
    {paramKey: 123});
// HTTP 响应状态码
var statusCode = ret["code"];  
// 被调用的 API 返回的数据，JSON 结构									
var retData = ret["data"];     
// 被调用的 API 返回的 "ret" 的值
var retCd = retData["ret"];
// 被调用的 API 返回的 Cookie JSON Map 对象
var cookie = ret["cookie"];
```


## http.platformPost(object:ApiInfo [, object:bodyParm, object:Param, object:header])

该方法与 http.platformGet 意义相同, 由于是内部调用, 并不区分 post/get, body 参数将与 url 参数合并调用 api.


## http.get(string:URL [, object:HttpParm, string:RetType, object:Header])

调用外部 api.

参数:

* URL: 完整路径
* HttpParm: http 请求参数
* RetType: 返回类型, 'string' 或 'json'
* Header: 请求头

```javascript
var ret = http.get("http://beidu.con/api", { cityp: 'dl' }, "json");
// HTTP 响应状态码
var statusCode = ret["code"];  
// 被调用的 API 返回的数据，JSON 结构
var retData = ret["data"];
// 被调用的 API 返回的 "ret" 的值
var retCd = retData["ret"];
// 被调用的 API 返回的 Cookie JSON Map 对象
var cookie = ret["cookie"];
```


## http.post(string:URL [, object:BodyParm, object:HttpParm, string:RetType, object:Header])

调用外部 api. 返回值定义与 http.get 相同.

参数:

* URL: 完整路径
* BodyParm: body 参数
* HttpParm: url 参数
* RetType: 返回类型, 'string' 或 'json'
* Header: 请求头


## http.asyncPlatformGet(..), http.asyncPlatformPost(..)

未实现, 2.0 平台内部调用 api 不需要实现.

