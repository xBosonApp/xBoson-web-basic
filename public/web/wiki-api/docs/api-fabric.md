# 区块链

[IBM Hyperledger Fabric](http://hyperledger-fabric.readthedocs.io) 客户端;  
与区块链网络交换数据, 生成智能合约.

```javascript
var fabric = require("fabric");
```


# API


## fabric.newChannel(object: config)

* config: 参数
* 返回创建的 Channel 对象

连接到区块链网络的一个通道上, [什么是通道](http://hyperledger-fabric.readthedocs.io/en/latest/channels.html).


```javascript
//
// 私钥字符串
//
var privateKey = `
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqG.............
-----END PRIVATE KEY-----`;
//
// 证书字符串
//
var certificate = `
-----BEGIN CERTIFICATE-----
MIICjzCCAjW..............................
-----END CERTIFICATE-----`;
//
// 通道配置
//
var config = {
  // 通道名称
  name : 'mychannel',
  // 可以有 1 到多个 peer, 
  peer : ['grpc://10.0.0.7:7051'],
  // 可以有 1 到多个 orderer, 
  orderer : ['grpc://10.0.0.7:7050'],
  // 登录帐户, 没有的属性也必须用空值 (空字符串, 空数组)
  enrollment : {
    // 用户名
    name : 'user1',
    // 会员服务提供商
    mspid : 'Org1MSP',
    roles : [],
    affiliation : '',
    account : '',
    // 私钥字符串
    privateKey : privateKey,
    // 证书字符串
    certificate : certificate,
  }
};
var channel = fabric.newChannel(config);
```


# Class Channel


## Channel.queryByChaincode(object:config)

* config: 请求参数
* 返回结果对象 ProposalResponse 的数组

向区块链网络发送查询提案.

```javascript
var proposalResponseArr = channel.queryByChaincode({
  // 区块链 ID
  chaincodeId : 'fabcar',
  // 函数名
  fcn : 'queryCar',
  // 函数参数
  args : ['CAR1'],
});
for (var i=0; i<proposalResponseArr.length; ++i) {
  // 将 Buffer 转换为字符串
  proposalResponseArr[i].payload = proposalResponseArr[i].payload.toString("utf8");
}
```

## Channel.sendTransactionProposal(object:config)

* config: 请求参数
* 返回结果对象 ProposalResponse 的数组

发送交易提案, 返回交易提案的响应数组.

```javascript
var tranResp = channel.sendTransactionProposal({
  chaincodeId : 'fabcar',
  fcn : 'changeCarOwner',
  args : ['CAR1', "Yanming-1"],
});
channel.sendTransaction(tranResp);
```


## Channel.sendUpgradeProposal(object:config)

* config: 请求参数
* 返回结果对象 ProposalResponse 的数组

更新交易提案, 返回交易提案的响应数组.

```javascript
var tranResp = channel.sendUpgradeProposal({
  chaincodeId : 'fabcar',
  fcn : 'changeCarOwner',
  args : ['CAR1', "Yanming-1"],
});
channel.sendTransaction(tranResp);
```


## Channel.sendInstantiationProposal(object:config)

* config: 请求参数
* 返回结果对象 ProposalResponse 的数组


```javascript
var tranResp = channel.sendInstantiationProposal({
  chaincodeId : 'fabcar',
  fcn : 'changeCarOwner',
  args : ['CAR1', "Yanming-1"],
});
channel.sendTransaction(tranResp);
```


## Channel.sendTransaction(proposalResponseArr)

* proposalResponseArr: 交易提案数组.
* 返回 CompletableFuture 对象

发送交易请求.


## Channel.queryBlockchainInfo()

* 无参数
* 返回区块链信息

```javascript
var info = channel.queryBlockchainInfo();
//
// 返回数据
//
info == {
  "height": 3,
  "currentBlockHash": "z4Lk9cZe85ZdnF91t0oydInX7qSz8Edf6xXEJA3IAkg=",
  "previousBlockHash": "sOckqBlv8y+xAEe0nmdy7eiaBLB7EXqatu2NgxeprvM="
};
```


## Channel.queryBlockByTransactionID(string:txID)

* txID
* 返回块信息

返回的数据结构与 `Channel.queryBlockByNumber` 相同


## Channel.queryBlockByNumber(number:num)

* num
* 返回块信息

```javascript
var info = channel.queryBlockByNumber(0);
//
// 返回数据
//
info == {
  "block": {
      "header": {
          "number": 0,
          "hash": "dIO+4lNq5hVQZ/2zR1zh8V+nnjL68kFj3RtDAOrztmk="
      },
      "data": [
          "CpJHCscGChUIARoGwjHgJKZlm3usaE="
      ],
      "meta": [
          "",
          "",
          "AA==",
          ""
      ],
      "descriptor": {
          "name": "Block",
          "fullName": "common.Block",
          "index": 8,
          "containningType": {},
          "nestedTypes": [],
          "fields": [
              {
                  "name": "header",
                  "fullName": "common.Block.header"
              },
              {
                  "name": "data",
                  "fullName": "common.Block.data"
              },
              {
                  "name": "metadata",
                  "fullName": "common.Block.metadata"
              }
          ],
          "enumTypes": [],
          "extensions": []
      }
  },
  "blockNumber": 0,
  "channelId": "mychannel",
  "dataHash": "dIO+4lNq5hVQZ/2zR1zh8V+nnjL68kFj3RtDAOrztmk=",
  "previousHash": "",
  "envelopeInfos": [
      {
          "channelId": "mychannel",
          "epoch": 0,
          "timestamp": "2018-02-02 08:57:27",
          "transactionID": "",
          "validationCode": 0,
          "type": "ENVELOPE"
      }
  ],
  "transactionActionInfos": [
      {
          "channelId": "mychannel",
          "epoch": 0,
          "timestamp": "2018-02-02 08:57:27",
          "transactionID": "",
          "validationCode": 0,
          "type": "ENVELOPE"
      }
  ]
};
```


# Class ProposalResponse

## 属性 status : Number

应答状态码

## 属性 message : String

应答字符串

## 属性 payload : Buffer

应答数据载荷, 可以调用 `Buffer.toString('utf8')` 转换为字符串.


# Class CompletableFuture

## boolean cancel(boolean mayInterruptIfRunning)
## boolean complete(T value)
## TransactionEvent get()
## TransactionEvent get(long timeout, TimeUnit unit)
## TransactionEvent getNow(T valueIfAbsent)
## TransactionEvent join()
## boolean isCancelled()
## boolean isDone()


# Class TransactionEvent


# Class TimeUnit

该对象的实例绑定在 `fabric` 对象上.

### 属性 fabric.HOURS         [class TimeUnit]
### 属性 fabric.MINUTES       [class TimeUnit]
### 属性 fabric.SECONDS       [class TimeUnit]
### 属性 fabric.MILLISECONDS  [class TimeUnit]
### 属性 fabric.MICROSECONDS  [class TimeUnit]


# Fabric 服务器搭建简介

## 前提条件: 

* docker last
* nodejs 6.x, npm, node-gyp
* python 2.x
* go 1.9+
* git


## 快速安装并启动一个区块链服务器:

以下安装以 `~/` 为根目录, 前提条件中的程序如果有不满足, 以下安装中会出现错误,  
需仔细检查, 使用 `hyperledger-fabric v1.0` 作为演示版本, 部分代码可能随时间推移有不同.


### 下载实例代码

```shell
git clone https://github.com/hyperledger/fabric-samples
```

### 下载必要的 docker 镜像, 

这会花费很长时间; 启动 Fabric 相关容器: orderer, ca, peer; 安装 nodejs 依赖包.

```shell
cd fabric-samples/fabric
./startFabric.sh
npm install
```

### 执行区块链网络操作

注册一个 admin 帐号, 再注册一个 user1 帐号, 使用 user1 帐号执行查询, 返回一个 json 结果集,
到此为止服务器搭建完成; 

`hfc-key-store` 目录中有创建用户的公钥 (在用户名文件中) 和私钥 (signingIdenitity 字段对应的 `*-priv` 文件中)

```shell
node enrollAdmin.js
node registerUser.js
node query.js
```


## 参考:

[安装前的准备](http://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

[构建第一个区块链网络](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html)

[第一个应用程序](http://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html)

[会员服务提供商](http://hyperledger-fabric.readthedocs.io/en/release/msp.html)