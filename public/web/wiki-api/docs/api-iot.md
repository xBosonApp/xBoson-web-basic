# IoT 物联基础设施

该模块需要引入方可使用.


```javascript
var iot = require("iot").open();
```

# API

## iot.restore(String:scenesid, String:productid)

* scenesid 场景id
* productid 产品id
 
地址信息配置完成后, 调用该方法启动消息处理线程, 
多个线程会在集群上做负载均衡.


## IotInfo[] iot.info(String:scenesid, String:productid)

* scenesid 场景id
* productid 产品id

返回所有线程的状态信息


## iot.stopAll(String scenesid, String productid)

* scenesid 场景id
* productid 产品id
 
停止指定场景上的全部线程


## iot.stop(String:scenesid, String:productid, String:node, String:type, int:tid)

* scenesid 场景id
* productid 产品id
* node 集群节点id
* type 消息类型
* tid 线程id

停止指定的线程