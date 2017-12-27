# 文件系统

文件系统需要引入 require("fs") 方可使用.


# 引入代码

```javascript
//
// 打开 ui 文件系统
//
var fs = require('fs').open('ui');
```


# 文件系统 API

## fs.readFile(string:path)

读取文件内容, 返回字节数组对象, 文件不存在会抛出异常


## fs.modifyTime(string:path)

返回文件最后修改时间毫秒值, 文件不存在抛出异常


## fs.readAttribute(string:path)

返回文件的属性对象, 文件不存在返回 null

```javascript
var attr = fs.readAttribute(basepath);
if (!attr) {
  return sys.setRetData(1, "找不到文件:" + path);
}
```


## fs.readFileContent(FileAttr)

读取文件内容到 FileAttr 中, 如果尝试读取目录会抛出异常, 无返回值.


## fs.makeDir(string:path)

创建目录, 如果上级目录是不存在的, 在必要时会自动生成这些目录.
如果目录已经存在会立即返回, 如果路径是文件会抛出异常.


## fs.writeFile(string:path, byte[]:content)

修改文件/创建文件, 同时会改变文件的修改时间;
如果文件的路径中包含不存在的目录, 必要时会自动生成这些目录.


## fs.delete(string:file)

删除文件/目录, 非空目录抛异常, 如果目录不存在则抛出异常.


## fs.move(string:src, string:to)

移动文件/目录到新的目录, 如果目的目录已经存在或源目录不存在会抛出异常


## fs.readDir(string:path)

读取目录结构, 并返回结果集, 路径上如果是文件会抛出异常

```javascript
var files = fs.readDir(basepath);
files.forEach(function (filename)) {
  //...
}
```


## fs.findPath(string:pathName)

模糊查询符合路径的完整路径集合, 总是大小写敏感的, 自行添加匹配模式.
返回搜索结果集对象 FinderResult.

```javascript
//
// 模式匹配
//
var finderResult = fs.findPath(basepath + '*' + finds + '*');
var files = finderResult.files;
```


## fs.findContent(string:path, string:content, bool:caseSensitive)

在目录中搜索文件内容, 返回找到的所有文件列表结果集 FinderResult;
目录会递归的搜索, 为了优化性能, 只返回最先搜索到的 30 个文件;
case = true 则启用大小写敏感.

```javascript
var finderResult = fs.findContent("/", "hello", true);
var files = finderResult.files;
```


# 文件属性对象 FileAttr

## 属性 path

文件/目录的完整路径


## 属性 type

1: 文件, 2: 目录


## 属性 lastModify

文件最后修改时间, 毫秒


## isDir()

是目录返回 true


## isFile()

是文件返回 true


## containFiles()

返回所有子节点路径列表, 路径中不包含当前目录的路径前缀.


## getFileContent()

返回文件内容字节数组, 调用 fs.readFileContent() 后该方法有效.


## getContentToString()

返回文件内容的字符串形式, 调用 fs.readFileContent() 后该方法有效.


## parentPath()

返回父路径字符串, 如果已经是父路径返回 null


# 搜索结果集对象 FinderResult

## 属性 files 

文件路径列表, 文件路径是完整路径.


## 属性 baseDir

搜索时使用的根路径字符串


## 属性 find

搜索的内容字符串


## 属性 caseSensitive

true 为大小写敏感


## 属性 hasMore

true 为搜索结果被截断, 需要增加搜索约束缩小搜索范围, 没有方法在不改变搜索条件的情况返回被截断的数据.