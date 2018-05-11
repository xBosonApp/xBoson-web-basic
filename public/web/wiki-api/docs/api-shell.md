# 外壳脚本模块

该模块仅在平台机构脚本环境中可用, 且调用方必须有管理员权限.

```javascript
var stub = require('shell');
var shell = stub.open("0");
var process = shell.execute("subdir/hello");
sys.addRetData(process.path, "path");
sys.setRetData(process.code, process.output, "path");
```

## 注意

1. 不应该在脚本中有任何等待用户输入的操作.
3. 不应该在脚本中输出过多内容.
4. 外壳脚本推荐在本机环境下调试, 最后在脚本环境中执行.
5. 外壳脚本最多执行 30 分钟, 超时则认为脚本异常, 会被杀死.


## 引入

```javascript
var shell = require("shell");
```


# Class ShellStub


## open()

打开默认运算节点上的执行对象, 若当前用户没有管理员权限, 会抛出异常;  
返回 Shell 的实例.


## open(nodeID)

打开 nodeID 指定运算节点上的执行对象, 若当前用户没有管理员权限, 会抛出异常;  
返回 Shell 的实例.


# Class Shell


## execute(string:path, string[]:args)

执行外壳脚本目录中的脚本文件, 可以没有扩展名, 根据不同的操作系统附加不同的扩展名,  
windows 平台使用 '.cmd'/'.bat'/'.exe' 扩展名, linux 平台使用 '.sh' 扩展名;  
args 为脚本接收的参数数组;  
返回一个结果集 Process de 的实例.


## execute(string:path)

没有参数的方式调用脚本.


## putEnv(string:name, string:value)

设置脚本执行时的环境变量; 环境变量在脚本执行前设置有效.


## getEnv(string:name)

获取环境变量的值; 返回 string.


## clearEnv()

清除所有环境变量; 
脚本退出前应该将环境变量清除, 防止其他脚本访问到敏感数据.


# Data Process

```JSON
{
  "output": "string",
  "code": int,
  "path": "string",
  "elapsed": int,
}
```

## output

脚本/程序的 stdout 输出.

## code

脚本/程序的退出代码.

## path

脚本/程序的完整路径.

## elapsed

运行程序消耗的时间, 单位 ms.