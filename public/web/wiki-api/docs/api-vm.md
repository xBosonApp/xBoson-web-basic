# 虚拟机

可以在虚拟机中运行 js 脚本,
错误的使用该模块会导致在服务器端执行任意代码 (在当前应用环境中).


## 引入:

```javascript
var vm = require('vm');
```


# API

## createContext([object:sandbox])

* sandox: 创建上下文时使用的沙箱参数
* 返回: 上下文对象 context

上下文对象用于将脚本的执行限制在一个范围里, 不会让脚本直接访问当前脚本中的变量.


```javascript
//
// 创建带有初始化变量的上下文, a 变量可以在脚本中直接访问
//
var context = vm.createContext({ a: 2 });
//
// 创建空的上下文
//
var context = vm.createContext();
//
// 改变上下文中的变量, 同样可以在运行过的上下文中获取结果变量
//
context.a = 5;
```


## isContext(object:sandbox)

* sandox: 创建上下文时使用的沙箱参数
* 返回: bool

测试对象是否是 createContext() 创建的沙箱.


## runInContext(string:code, object:context [, object:options])

* code: 脚本代码
* context: 上下文对象
* options: (可选) 选项
* 返回: object 脚本的返回值

在指定的上下文中运行脚本并返回结果;

options 中的参数:

* filename: 文件名, 一旦抛出错误, 可以指定错误堆栈中的文件名, 默认 `<eval>`

```javascript
var vm = require('vm');
var context = vm.createContext({ a: 2 });
//
// ret 返回 3
//
var ret = vm.runInContext("1+a", context);
```