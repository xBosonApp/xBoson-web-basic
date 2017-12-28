# UUID

该模块需要引入方可使用.
生成各种 UUID 字符串.

```javascript
var uuid = require('uuid');
```


# API

关于 uuidHandle:

> uuid 句柄中保存着 uuid 原始字节信息, 可以将句柄作为中介, 将一种格式转换为另一种格式.


## uuid.v1()

基于当前时间和 MAC 地址生成标准 UUID 字符串, 长度 36 字符.

```uuid
fffffe9f-650f-1e2d-dd8e-3313083c275c
```

## uuid.v4()

利用随机算法生成标准 UUID 字符串, 长度 36 字符.

```uuid
14089c69-8b6c-4c70-8125-edb5d4579dbc
```


## uuid.v1obj(), uuid.v4obj()

基于生成 UUID 对象句柄.

```javascript
var uuidHandle = uuid.v1obj();
```


## uuid.ds()

基于 v4() 生成 UUID, 生成的字符串中没有 '-' 符号, 长度 32 字符.

```uuid
fffffe9f650f1e2ddd8e3313083c2759
```


## uuid.ds(uuidHandle)

将 uuid 句柄转换为 32 字符长度字符串.

```javascript
var uuidHandle = uuid.v1obj();
var str = uuid.ds(uuidHandle);
```


## uuid.parseDS(string:dsuuid)

将 32 字符长度的 uuid 字符串, 转换为 uuid 句柄.

```javascript
var str = 'fffffe9f650f1e2ddd8e3313083c2759'
var uuidHandle = uuid.parseDS(str);
```


## uuid.zip()

基于 v4() 生成压缩的 UUID, 长度 22 字符, 可以解压回原始 UUID.

```uuid
w6uEV4G9RZW9-uS1Kr-Sew
```


## uuid.zip(uuidHandle)

将 uuid 句柄压缩为 22 字符的字符串.

```javascript
var uuidHandle = uuid.v1obj();
var str = uuid.zip(uuidHandle);
```


## uuid.unzip(string:ziped)

将压缩的 uuid 字符串转换为 uuid 句柄.

```javascript
var str = 'w6uEV4G9RZW9-uS1Kr-Sew';
var uuidHandle = uuid.unzip(str);
```


# UUID 的版本

UUID 的完整定义在 [RFC 4122](https://tools.ietf.org/html/rfc4122.html) 中有说明.


## Version 1

This generates a unique ID based on a network card MAC address and a timer. These IDs are easy to predict (given one, I might be able to guess another one) and can be traced back to your network card. It's not recommended to create these.

## Version 3

This generates a unique ID from an MD5 hash of a namespace and name. If you need backwards compatibility (with another system that generates UUIDs from names), use this.

## Version 4

These are generated from random (or pseudo-random) numbers. If you just need to generate a UUID, this is probably what you want.


## Version 5

This generates a unique ID from an SHA-1 hash of a namespace and name. This is the preferred version.