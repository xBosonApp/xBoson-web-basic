# 字节缓冲区

方便在字节数组和字符串之间做转换


# API

下文中的 `OBJ` 可以替换为 `sys`, `crypto`, `digest`, `chain` 等模块, 
因为这些模块都实现了下面的方法.


## Bytes OBJ.toBytes(String str)

将 utf8 字符串的底层字节数组存入缓冲区.

```js
var bytesObj = OBJ.toBytes('somestring');
```


## Bytes OBJ.toBytes(String str, String coding)

将字符串按照编码转换为字节缓冲区, coding 的编码格式可以为:

* `hex` 16进制字符串.
* `base58` base58 格式.
* `base64` 普通 base64 格式 .
* `base64url` base64url 格式 without padding.
 
```js
var bytesObj = OBJ.toBytes("00010203", 'hex');
```


## Bytes OBJ.joinBytes(Bytes[])

将缓冲区数组组合为单个缓冲区, [Bytes 类说明](docs/api-digest.md).
该方法比多次调用 Bytes.concat 效率高.

```js
var bytesObj = OBJ.joinBytes(bytesObj1, bytesObj2, bytesObjN);
```


# Class Bytes

存储字节数组, 在必要时转换为 string, 方便进行 json 的转换.

## String toString()

转换为字符串, 使用 base64url without padding 编码.

## String toString(string: coding)

使用指定的编码方式将底层字节数组转换为字符串, 可用编码见上文.

## String toHex()

返回数组的 16 进制表示的字符串.

## Array bin()

返回原始数组.

## String toJavaString()

将字节数组按照 UTF-8 作为底层数据编码为字符串.

## Bytes concat(Bytes other)

将自身与另一个缓存连接, 返回包含两个缓冲区数据的缓冲区.

## int length()

返回字节数组的长度

## [] 索引 (未实现)

使用索引可以读写底层字节数组, 索引超出范围会抛出异常;
读取返回底层字节值, 写入必须是数字类型切范围在 -127~+128 之间, 超出的数值被剪裁.