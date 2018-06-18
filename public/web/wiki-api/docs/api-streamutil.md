# 流对象工具

使用流的方式操作数据, 可以防止内存爆炸.


# DEMO

## 压缩字符串为 BASE64 字符串.

```js
var stream = require('streamutil');
var strstream = stream.openStringBufferOutputStream();
var b64 = stream.openBase64OutputStream(strstream);
var gzip = stream.openGzipOutputStream(b64);
//
gzip.write("<xml><data>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</data></xml>");
gzip.flush();
//
console.log(strstream.toString());
```


## 解压 BASE64 为原文.

```js
var is = stream.openStringInputStream(
    "H4sIAAAAAAAAAO1WXU8aQRR9tr+C/gBcpL602ZBs2Y1sKkvDYpv2ZWMKD03a1");
var ib = stream.openBase64InputStream(is);
var ig = stream.openGzipInputStream(ib);
var line = stream.openLineReader(ig);
var s;
while (s = line.readLine()) {
  console.log(s);
}
```


# 可用 api

引入

```js
var stream = require('streamutil');
```

## JsOutputStream openGzipOutputStream(JsOutputStream:out)

打开压缩流, 向返回的输出流写入数据, 压缩后的数据输出到 out.


## JsInputStream openGzipInputStream(JsInputStream:in)

打开解压缩流, 从 in 读取压缩数据, 从返回的输出流读取原始数据.


## JsOutputStream openBase64OutputStream(JsOutputStream: out)

打开 BASE64 编码流, 向返回的输出流写入数据, 压缩后的数据输出到 out.


## JsInputStream openBase64InputStream(JsInputStream: in)

打开 BASE64 解码流, 从 in 读取压缩数据, 从返回的输出流读取原始数据.


## JsOutputStream openStringBufferOutputStream()

创建一个字符串缓冲区流, 向返回的流中写入数据, 这个对象的 toString() 方法输出所有写入的字符串.


## JsInputStream openStringInputStream(String: s)

把字符串放入输入流中进行读取.


## LineNumberReader openLineReader(JsInputStream in)

将输入流解析为字符串, 一行一行的读取.


## JsOutputStream openXMLOutputStream(JsOutputStream out)

将输出流包装为 xml 文本内容输出流, 输出的字符先被 xml 字符转移后输出到 out.


# class JsOutputStream

所有的输出流父类


## flush()

将缓冲数据清空.


## close()

关闭输出流


## write(String:data)

向输出流写字符串


## write(Buffer:data, int:begin, int:len)

向输出流写二进制数据, 从缓冲区的 begin 偏移开始到 len 个字节.


## finish()

有一些流不希望关闭底层流, 但是又需要完成最后的输出 (比如 gzip 要写出尾数据), 
则会实现该方法, 通常该方法什么都不做.


# class JsInputStream

所有输入流的父类


## close()

关闭输入流


## read(Buffer:target, int:begin, int:len)

从输入流读取 len 字节的数据, 保存到 target 缓冲区的 begin 位置开始;
若缓冲区长度不够会抛出异常.


# LineNumberReader

用于一行一行从流中读取字符串.


## readLine()

返回下一行字符串, 如果流中没有更多数据, 返回 null.


## int getLineNumber()

返回当前行号