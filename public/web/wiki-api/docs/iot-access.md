# IoT 物联网平台接入

物联平台以 MQTT 协议为基础构建, 设备或网关需有能接入 MQTT 协议的能力,
其他任何协议如 Modbus 可以使用透传设备或直接转为 MQTT 的载荷.

本文档为数据处理/设备开发/脚本开发而编写.


# 概念

## 设备账户

设备使用该账户登录 mqtt 服务器, 平台对密码做了特殊规定见后文, 
每个设备账户只对当前平台用户可见, 除非设置了设备账户共享.

## 场景

用户可以创建多个场景, 该场景与场景中的数据只对当前创建场景的平台用户可见
除非设置了场景共享;

## 产品

一个产品是对一种设备的描述(设备原型或物模型), 产品规定了基础属性/数据定义/命令列表/事件,
在接收数据时会(自动)产生设备实例; 当产品定义完成必须启动处理器线程, 使数据开始流转.

## 设备

设备可以手动创建, 更一般的是由物理设备推送的数据自动创建逻辑设备实例,
设备记录了总数据量, 和最新状态;

## 命令

命令由物理设备接收并执行, 对必须抵达的命令, 应使用 Qos1 或 Qos2 设置主题.

## 事件

事件可以由设备产生, 也可以由平台产生, 或产品脚本产生, 事件可用于调试产品脚本中的错误.

## 设备脚本

设备脚本可对设备产生的原始数据做协议解析, 也可以生成设备可读的命令数据, 
脚本在 data 处理器线程中启动.

## 线程

每个产品都有 4 个线程类型对应 4 个主题, 通常应设置线程数量为 1,
当一个线程类型的 cpu 占用过高, 则应该设置多个该类型的线程,
当配置集群时, 线程会在多个集群节点上启动; 
线程数量不应该超过逻辑 cpu 数量, 并预留 cpu 给其他任务.


# MQTT 主题

主题格式由平台定义规则, 必须按照规则进行数据传输,

## IoT 平台数据流程图:

![screen](./img/iot-data-stream.png)


MQTT 主题概要:

* /场景id/产品id/设备id/data  - 设备发送, 设备原始数据, 任意类型
* /场景id/产品id/设备id/event - 设备发送, 消息格式
* /场景id/产品id/设备id/state - 设备发送, 状态, 字符串
* /场景id/产品id/设备id/cmd   - 设备接收, 设备原始数据, 用于发送控制命令 
* /场景id/产品id/设备id/save  - 平台接收, json 格式, 平台保存的数据


## data 设备数据主题格式

该主题由设备推送, 由设备定义数据格式; 由 SAAS 应用或 PAAS 产品处理脚本订阅,
数据接收后必须对数据进行解析, 解析后的数据推送到 save 主题中进行保存;
SAAS应用可在数据处理期间产生控制命令或事件.

如果设备可以直接推送 json 格式, 则可以掠过 data 主题, 将数据直接推送
到 save 主题中.

发送到该主题的数据作为缓冲, 将进入处理器进行处理, 只有推送到 save 中后才会持久化.


## save 保存数据主题格式

通常由 SAAS 应用或 PAAS 产品处理脚本发送, 发送的数据会被 PAAS 平台按规则处理保存;
也可以由设备直接推送.

必须是 JSON 数据格式, data 字段与类型必须和 `产品` 定义中的 `数据列表` 匹配.
当消息中的字段没有在 `数据列表` 中定义, 该数据不会被保存.

```json
{
  "time" : 0, //长整数, 数据发送时间, UNIX 时间戳
  "data" : {
    // 数据, 与 `产品` 定义中的 `数据列表` 匹配, 
    // k是数据名, v是数据
    "k" : "v"
  } 
}
```

## state 状态主题

一条可阅读的字符串, 该主题用于更新设备状态, 状态不保留历史, 设备仅保存最新状态.


## event 事件主题格式

该主题由 SAAS 应用或 PAAS 产品处理脚本发送, PAAS 平台订阅,
事件历史会被保留, 并等待用户处理.

JSON 数据格式, 必须包含的固定字段, 规则如下:

```json
{
  "code"  : 0, // 消息代码, 未设置时值为0
  "msg"   : "可阅读的信息文本, 必填",
  "cd"    : 0, // 消息发送的时间, 自1970开始的毫秒, UNIX 时间 (消息在 mqtt 中中转会有延迟), 如果省略该参数则使用接收到消息的时间.
  "level" : 0, // 消息级别, 定义在字典 `IOT.001`-`EVENT_LEVEL` 中, 未设置是值为1
  "data"  : {
    //消息数据, 可定义任意字段, 字段会被 `产品/消息字典解读`
  }
}
```

## cmd 命令主题格式

该主题由 SAAS 应用或 PAAS 产品处理脚本发送, 由设备订阅后接收,
设备收到命令后进行对应的处理, 格式为设备可理解的自定义格式,

在平台上定义的 JSON 命令格式在经过 SAAS 应用或 PAAS 产品处理脚本后将被转换为
对应的命令格式.

只有 PAAS 产品脚本发送的命令产生历史记录, SAAS应用发送的命令数据没有历史记录.


# 脚本开发

脚本基础:

```javascript
// Created by xBoson system

// !! 不要这样做, 脚本可能在多线程中运行, 访问/修改这样的变量会导致脚本崩溃.
var dont_Do_This = {}
// 常量, 只读取不修改, 可以安全的在脚本中访问
var const_var = "dont write value"

//
// 该函数必须定义, 接收 data 主题发来的数据时被调用
// 做协议解析后进行保存, 如果什么都不做, 则数据会被忽略
//
// 参数:
// payload - Bytes 类型, 接收的数据载荷
// dev - Device 类型见后文
//
function on_data(payload, dev) {
  // 返回 js (字节)数组, 进行二进制处理
  payload.bin();
  // 返回 utf8 编码字符串
  payload.toJavaString();
  // 保存数据
  dev.saveData(d);
  // 修改函数外变量会引起崩溃!
  dont_Do_This.a = "Don't do this!"
}

//
// 该函数必须定义, 接收命令后转换为设备可识别的数据
//
// 参数:
// cmd - Object 类型, k是命令名, v是命令值, 规则在 '产品命令列表' 中定义
// dev - Device 类型
//
function on_cmd(cmd, dev) {
  // 可以返回 Uint8Array/Int8Array 用于二进制, 或返回字符串.
  // 返回的数据直接发送给设备
  return new Uint8Array(0);
}
```

## class Device

对设备进行操作


### void saveData(Object: data) 

保存数据, data 格式应在产品 `数据列表` 中存在且符合定义, 否则该方法抛出异常

```javascript
dev.saveDate({
  data1 : 0,
  data2 : 1.2,
});
```

### void sendCmd(Object: cmd)

发送命令, cmd 格式应在产品 `命令列表` 中存在且符合定义, 否则会抛出异常

```javascript
dev.sendCmd({
  command1 : 0,
  command2 : 'off',
});
```

### void changeState(string: state)

改变当前设备的状态

```javascript
dev.changeState('在线');
```

### void sendEvent(Number: code, Number: level, String msg, Object: data)

发送一个事件

参数:

* code 消息代码
* level 事件等级, 在字典 `IOT.001` / `EVENT_LEVEL` 中定义.
* msg 消息字符串
* data 消息数据, 可随意定义, 在产品 `事件字典` 中可以定义字段的说明.

```javascript
dev.sendEvent(100, 3, '断电恢复', {
  offtime : '2020/1/1 09:22:00',
  ontime  : '2020/1/5 02:10:11',
});
```

### String deviceId()

返回设备 id

### String productId()

返回产品 id

### String scenesId()

返回场景 id


# 设备接入

设备使用通用 MQTT 协议进行接入.


## 登入

登入用户使用设备用户名, 登入密码需进行以下运算, 多个设备不能始终用一个密码登录平台,
否则后来的设备无法登入, 之前的设备也会被踢掉.

密码加密算法:

1. 生成 16 字节随机数
2. 按顺序执行 md5: 随机数, 用户名, 密码原文
3. 将随机数和 md5 签名连接到一个字节数组中(前16字节为随机数, 后16字节为md5结果)
4. 该字节数组执行 base64, 结果为密码
 
Java 驱动: https://github.com/eclipse/paho.mqtt.java  
Java 代码如下:
```java
import java.security.MessageDigest;
import java.util.Base64;

String genPassword(String username, String password) throws Exception {
  byte[] b = new byte[16 + 16];
  rand.nextBytes(b);
  MessageDigest md = MessageDigest.getInstance("md5");
  md.update(b, 0, 16);
  md.update(username.getBytes("UTF-8"));
  md.update(password.getBytes("UTF-8"));
  md.digest(b, 16, 16);
  return Base64.getEncoder().encodeToString(b);
}
```

Nodejs 驱动: https://github.com/mqttjs/MQTT.js  
Nodejs 代码如下:
```javascript
const crypto = require('crypto');

function genPassword(username, password) {
  const rand = crypto.randomBytes(16);
  const md5 = crypto.createHash('md5');
  md5.update(rand);
  md5.update(username);
  md5.update(password);
  return Buffer.concat([ rand, md5.digest() ]).toString('base64');
}
```

C 高级驱动: https://github.com/eclipse/paho.mqtt.c  
C 嵌入式驱动: https://github.com/eclipse/paho.mqtt.embedded-c  
C 代码: 
```c
#include <openssl/md5.h>
#include <stdlib.h>

int genPassword(char *loginPass, char *name, int namelen, char *pass, int passlen) {
  // srand(time(NULL));
  for (int i=0; i<16; ++i) {
    loginPass[i] = (char)(rand() % 0xFF);
  }
  
  MD5_CTX c;
  MD5_Init(&c);
  MD5_Update(&c, loginPass, 16);
  MD5_Update(&c, name, namelen);
  MD5_Update(&c, pass, passlen);
  MD5_Final(loginPass+16, &c);
  return 32;
}
```

## 主题 

设备将自身的序列号设置到主题字符串中, 在平台端会自动创建该设备的逻辑设备进行对应.
数据质量由设备的 Qos 决定下限, 平台订阅 Qos 决定上限.

主题数据可以是任何类型, 这些数据将由平台设备脚本或 SaaS 处理.


# 数据接口

`orgid` 应替换为正确的机构 id.

平台机构: `a297dfacd7a84eab9656675f61750078`


## 物模型

接口: `http://somehost/xboson/app/orgid/2e617eb7e1744bbcb6a0518fa85a84a5/basic/prod_list`

HTTP 参数:

* scenes 必须, 场景 id 
* _id 可选, 产品完整id, 如未设置则返回场景中所有产品的物模型

返回:

```json
{
  "msg": "成功", // 返回消息
  "code": 0,     // 成功返回 0
  "data": [      // 产品列表
    {
      "_id": ".YcVfRcNfSZDuJXG7QPy4ce.YcVfRcFZouHj3i3fUXAAh2", // id 由 pid 和 scenes 组成
      "pid": "YcVfRcFZouHj3i3fUXAAh2",    // 产品id
      "scenes": "YcVfRcNfSZDuJXG7QPy4ce", // 场景 id
      "name": "呼吸机",                   // 产品名
      "desc": "",                         // 产品描述
      "cd": "2020-11-19 15:11:41",        // 产品创建时间
      "md": "2020-11-19 15:11:41",        // 产品修改时间
      "meta": [ // 基础属性列表
        {
          "name": "潮气量", // 属性名
          "desc": "",       // 属性描述
          "type": "100",    // 数据类型
          "notnull": 0,     // 非空字段
          "defval": "1.9",  // 默认值
          "dict": ""        // 字典
        },
        {
          "name": "呼吸时间",
          "desc": "",
          "type": "100",
          "notnull": 0,
          "defval": "1",
          "dict": ""
        },
      ],
      "data": [ // 数据列表
        {
          "name": "d2",     // 数据名
          "desc": "氧浓度", // 数据描述
          "type": "2",      // 数据类型
          "unit": ""        // 数据单位
        },
        {
          "name": "d0",
          "desc": "调试器",
          "type": "2",
          "unit": ""
        },
      ],
      "cmd": [ // 命令列表
        {
          "name": "c2",       // 命令名
          "desc": "打开照明", // 命令描述
          "type": "2"         // 数据类型
        }
      ],
      "event": { // 事件字典
        "e1"  : "event 1",
        "data": "原始数据"
      }
    }
  ]
}
```

## 读设备数据

接口: `http://somehost/xboson/app/orgid/2e617eb7e1744bbcb6a0518fa85a84a5/basic/dev_data_read`

HTTP 参数:

* did 设备完整 id, 场景+产品+设备id 组成
* name 数据名
* time 时间参数
* type 时间范围类型

返回:

```json
{
  "msg": "成功",
  "code": 0,
  "data": {
    "_id": "!yr~.YcVfRcNfSZDuJXG7QPy4ce.YcVfRc3SnyvB6CneZhXxZG.Jdevice1$d1",  // 数据id
    "dev": ".YcVfRcNfSZDuJXG7QPy4ce.YcVfRc3SnyvB6CneZhXxZG.Jdevice1",         // 设备完整 id
    "l": 4.047446524805735,     // 最后数据
    "v": {                      // 范围数据列表
      "2020": 4.047446524805735
    },
    "time": "2020-11-25T08:32:02.588Z", // 数据时间
    "name": "d1",                       // 数据名
    "type": 1                           // 数据类型
  }
}
```

## 发送命令

接口: `http://localhost:8080/xboson/app/orgid/2e617eb7e1744bbcb6a0518fa85a84a5/basic/send_cmd`

HTTP 参数:

* _id 设备完整 id, 场景+产品+设备id 组成
* k 命令名列表, 与v 长度一致并一一对应 
* v 命令值列表, 与k 长度一致并一一对应

返回:
```json
{
  "msg": "成功",
  "code": 0,
}
```