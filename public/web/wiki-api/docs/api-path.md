# 路径解析


> 无论在如何, 都是用 '/' 符号来分割路径片段.


## 引入

```javascript
var path = require("path");
```


# API

## path.checkSafe(string:pathStr)

如果路径中有不安全字符串将会抛出异常.


## path.normalize(string:pathStr)

path.normalize() 方法会规范化给定的 path，并解析 '..' 和 '.' 片段。

当发现多个连续的路径分隔符时 '/'，它们会被单个的路径分隔符 '/' 替换。 末尾的多个分隔符会被保留。


## path.dirname(string:pathStr)

返回一个 path 的目录名，类似于 Unix 中的 dirname 命令。
目录已经是根目录返回 null.


## path.basename(string:pathStr)

只返回文件部分, 目录被丢弃, 目录格式无效返回 null.


## path.extname(string:pathStr)

返回 path 的扩展名，即从 path 的最后一部分中的最后一个 .（句号）字符到字符串结束。 如果 path 的最后一部分没有 . 或 path 的文件名（见 path.basename()）的第一个字符是 .，则返回一个空字符串。