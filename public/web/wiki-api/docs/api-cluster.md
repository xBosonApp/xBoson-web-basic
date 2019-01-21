# 集群管理

该模块需要引入方可使用.
只在平台机构脚本环境中可用.

```javascript
//
// 非平台机构中调用 open() 会抛出异常.
//
var cluster = require("cluster").open();
```


# API


## cluster.list()

* 没有参数
* 返回数组

返回所有正在运行节点的 ID 数组, 数组中的元素是 String.


## cluster.info(id)

* id: String 节点 ID
* 返回节点信息 ComputeNodeInfo 对象, 如果 id 无效返回 null


```javascript
var ids = cluster.list();
var list = [];
//
// 迭代所有进程
//
for (var i=0; i<ids.length; ++i) {
  list[i] = cluster.info(ids[i]);
}
```


## cluster.state(id)

测试节点的运行状态, 并返回状态码.

* cluster.UNKNOW: 未知状态
* cluster.RUNNING: 运行中
* cluster.DOWN: 下线


# class ComputeNodeInfo

该对象是非动态对象, 不要尝试绑定新的属性/方法.

## 属性 ip : Array[String]

节点 ip 地址数组, 元素是以 '.' 分割的十进制 ip 地址字符串.

## 属性 nodeID : String

节点 ID, 用于结束进程.

## 属性 startAt : Number

开始时间的毫秒值.

## 属性 rpcPort: Number

RPC 注册表监听端口.

## 属性 javaVersion : String

Java 版本号

## 属性 javaVendor : String

Java 供应商

## 属性 osName : String

操作系统名称

## 属性 osVersion : String

操作系统版本

## 属性 osArch : String

操作系统类型