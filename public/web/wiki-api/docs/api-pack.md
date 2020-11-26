# 文件打包

> 把多个文件打包到一起, 针对流进行操作, 可处理大文件


## 引入

```javascript
var pack = require("pack");
```


# API

## PackData pack.createZipWriter(JsOutputStream)

返回一个打包器对象, 以 zip 文件格式输出到 JsOutputStream 中.

```javascript
// 直接把多个文件打包输出到客户端, 客户端接收原始字节流, 
// 浏览器将提示用户保存文件
var z = pack.createZipWriter(sys.getResponseStream('zipfilename.zip'));
z.add('a.txt', 'hello world!');
z.add('dir/b.txt', InputStream);
z.close()
```


## UnPackData pack.createUnZipReader(JsInputStream)

返回一个解包对象

```javascript
// 处理所有上传的文件
sys.request.multipart(function(item) {
  var uz = pack.createUnZipReader(item.openInputStream());
  while (uz.hasNext()) {
    var pathname = uz.path();
    var istream = uz.openInput();
  }
});

```


# class PackData

打包器对象

## void add(String filename, InputStream data)

打包文件, 文件内容从 data 中读取.

## void add(String filename, String data)

打包文件, 使用字符串作为内容

## void add(String filename, Bytes data)

打包文件, 使用字节数组作为内容

## void add(String filename, Buffer data)

打包文件, 使用缓冲区作为内容

## close()

关闭打包器


# class UnPackData

解包器

## boolean hasNext()

如果有未处理的文件条目返回 true, 同时将上下文切换到该文件条目.  
在处理第一个文件之前, 必须调用一次该方法.

## String path()

返回文件的完整路径

## boolean isDirectory()

如果是目录返回 true

## long size()

返回文件大小

## long getTime()

返回文件的时间, UNIX 时间戳.

## JsInputStream openInput()

打开一个输入流用于读取数据