# 进程管理

该模块需要引入方可使用.
只在平台机构脚本环境中可用.

```javascript
//
// 非平台机构中调用 open() 会抛出异常.
//
var pm = require("pm").open();
```


# API


## pm.list()

* 没有参数
* 返回数组

返回所有正在运行的进程, 数组中的元素是 PublicProcessData 对象.


```javascript
var allProcess = pm.list();
//
// 迭代所有进程
//
for (var i in allProcess) {
  var p = allProcess[i];
  //
  // 将应用 ID 转换为应用名称
  //
  p.app = getAppName(p.app);
}
```


## pm.kill(pid)

* pid: Number 类型, 进程 ID
* 返回 bool

结束进程, 如果成功的结束了运行中的进程返回 true, 如果进程不存在或进程已经结束返回 false.


## pm.stop(pid)

pm.kill 的别名


# class PublicProcessData

该对象是非动态对象, 不要尝试绑定新的属性/方法.

## 属性 processId : Number

进程 ID, 可用于结束进程.

## 属性 beginAt : Number

开始时间的毫秒值.

## 属性 runningTime: Number

持续运行时间的毫秒值.

## 属性 callUser : String

调用该 api 的用户名.

## 属性 org : String

机构 id

## 属性 app : String

应用 id

## 属性 mod : String

模块 id

## 属性 api : String

接口 id