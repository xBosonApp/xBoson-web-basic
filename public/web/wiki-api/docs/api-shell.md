# 外壳脚本模块

该模块仅在平台机构脚本环境中可用, 且调用方必须有管理员权限.

```javascript
var shell = require('shell');
var executor = shell.open();
var process = executor.execute("hello");
sys.addRetData(process.path, "path");
sys.setRetData(process.code, process.output, "path");
```

# 注意

1. 不应该在脚本中有任何等待用户输入的操作.
2. 不能使用参数.
3. 不应该在脚本中输出过多.
4. 外壳脚本应该在本机环境下调试, 最后在脚本环境中执行.
5. 外壳脚本最多执行 30 分钟, 超过认为脚本异常, 会被终止.


## 引入

```javascript
var shell = require("shell");
```


## open()

打开执行对象, 若当前用户没有管理员权限, 会抛出异常


## execute(string:path)

执行外壳脚本目录中的脚本文件, 可以没有扩展名, 根据不同的操作系统附加不同的扩展名, windows 平台使用 '.cmd' 扩展名, linux 平台使用 '.sh' 扩展名.

返回一个结果集:
```JSON
{
  "path": "脚本的完整路径",
  "code": "脚本的返回代码",
  "output": "脚本的返回字符串",
}
```