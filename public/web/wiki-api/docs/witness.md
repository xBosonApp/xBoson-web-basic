# 区块链见证者节点接入方法

当新的区块数据即将加入区块链前, 区块数据将被发送给见证者节点进行签名, 见证者节点可选则是否记录区块.  
平台使用 http 接口来调用见证者节点上的 api; 为了数据安全, 见证者节点的私钥一定不要通过网络流转, 
无论任何时刻, 平台都不会要求提供私钥, 该节点的计算机只有有权限的人员访问/操作.
一旦见证者节点注册到平台, 且被区块链引用, 该节点离线或不可用将导致区块链无法加入新的块, 或无法验证,
通过设置灵活的共识策略可以防止单点失败, 让区块链网络更健壮.

任何由见证者节点漏洞或不当操作引起数据泄露, 平台不承担任何责任.


# 主动调用

这些接口由见证者节点主动调用平台接口.  
通常在这些调用结束后, 平台会调用一次 sign 接口来验证公钥的有效性.


## `/xboson/witness/register`

见证者节点主动调用该接口将自身注册到平台, 一旦注册成功, 公钥将不可变.

调用时通过 Http 参数上传数据, 可选 GET 或 POST 方法, 注意参数值需要经过 url 编码, 下面的 url 只用于展示不是合格的 url:

```URL
http://localhost:80/xboson/witness/register?algorithm=SHA256withECDSA&publickey=PZ8Tyr4Nx8MHsRAGMpZmZ6TW...&host=192.168.0.1&port=7000&urlperfix=witness/
```

参数说明:

* `algorithm` 密钥对生成算法, 必须是 `SHA256withECDSA`
* `publickey` 公钥, `ASN.1` `base64` 编码格式字符串.
* `host` 字符串, 见证者主机网络地址, 平台必须能通过主机+端口访问到该节点.
* `port` 数字, 见证者主机网络端口.
* `urlperfix` 字符串, 见证者 http 服务接口前缀, 当平台调用约定的接口时将该前缀连接在 url 的前面, 除此之外平台不会自动添加多余的符号.

返回:

```json
{
  "code" : 0,
  "msg"  : "ok",
  "id"   : "ewonvw3829nvcz"
}
```

返回说明:

* `code` [返回码说明](docs/codes.md), 成功返回 0.
* `msg`  返回消息字符串.
* `id`   成功时返回见证者节点唯一识别 id, 见证者节点有必要保存于本地.


## `/xboson/witness/change`

修改已经注册节点的网络地址.

```URL
http://localhost:80/xboson/witness/change?id=ewonvw3829nvcz&host=192.168.0.1&port=7000&urlperfix=witness/
```

参数说明:

* `id` 必须, 注册时得到的标识.
* `host` 必须, 新的主机地址.
* `post` 必须, 新的端口号.
* `urlperfix` 可选的, 新的 url 前缀.

返回:

```json
{
  "code" : 0,
  "msg"  : "ok",
}
```

返回说明:

* `code` [返回码说明](docs/codes.md), 成功返回 0.
* `msg`  返回消息字符串.



# 回调接口

见证者必须实现这些 http 接口供平台调用, 下文中的接口名不包含 url 前缀, 如果注册时提供了 url 前缀, 如: `ws/`,   
则最终接口将调用: `http://192.168.0.1:7000/ws/sign`


## sign

使用私钥签名一个数据块; 接口通过 POST 接收数据, 二进制原始待签名数据存于 HTTP BODY 中;  
http 参数 key 指明当前块的主键, 因为块尚未上链, 仅作为存档;
Http Header 定义:

```txt
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
```

接口签名数据, 签名后的二进制数据格式为 `ASN.1` 用 Response Body 返回, http 返回码为 200;  
若要返回错误消息, 则返回码 500, Response Body 中存储错误消息字符串.


## deliver

通知见证者数据块已经上链, 见证者可以选择忽略该接口的实现, 参数通过 http 传递:

```url
http://192.168.0.1:7000/ws/deliver?key=...&success=bool
```

参数说明:

* `key` 数据块的 key, 见证者可以通过平台接口拉取区块的完整数据
* `success` 区块是否成功上链, 成功为 `1` 失败为 `0`

返回说明:

1. 如果接口返回 http 代码 200, 并不需要返回更多数据, 平台会按约定继续调用 deliver 接口.
2. 如果接口返回 http 代码 404, 表示见证者不关心块是否递交, 平台后续不再调用 deliver 接口, 除非见证者再次通过 change 注册自己.
3. 如果接口返回其他的 http 代码, 则认为接口执行失败, 最多会用同样的参数重试 3次, 如果失败则不再调用 deliver 接口.