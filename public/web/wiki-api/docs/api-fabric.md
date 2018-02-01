# 区块链

IBM Hyperledger Fabric 客户端, 用于构建区块链式的智能合约.

```javascript
var fabric = require("fabric");
```


# API

## fabric.newChannel(object: config)

* config: 参数
* 返回创建的 Channel 对象

连接到区块链网络的一个通道上, [什么是通道].(http://hyperledger-fabric.readthedocs.io/en/latest/channels.html)


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
  account : {
    // 用户名
    name : 'user1',
    mspid : 'Org1MSP',
    roles : [],
    affiliation : '',
    // 私钥字符串
    privateKey : privateKey,
    // 证书字符串
    certificate : certificate,
  }
};
var channel = fabric.newChannel(config);
```


# Class Channel

## Channel.queryByChaincode(object: config)

* config: 请求参数
* 返回结果对象 ProposalResponse

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
```


# Class ProposalResponse

## 属性 status : Number

应答状态码

## 属性 message : String

应答字符串

## 属性 payload : Buffer

应答数据载荷, 可以调用 `Buffer.toString('utf8')` 转换为字符串.


# Fabric 服务器搭建简介

前提条件: 

* docker last
* nodejs 6.x, npm, node-gyp
* python 2.x
* go 1.9+
* git


快速安装并启动一个区块链服务器:

以下安装以 `~/` 为根目录, 前提条件中的程序如果有不满足, 以下安装中会出现错误, 需仔细检查, fabric-samples 可能随时间推移有不同.

```sh
#
# 下载实例代码
#
git clone https://github.com/hyperledger/fabric-samples
cd fabric-samples/fabric

#
# 下载必要的 docker 镜像, 这会花费很长时间.
# 启动 Fabric 相关容器: orderer, ca, peer
#
./startFabric.sh

#
# 注册一个 admin 帐号, 再注册一个 user1 帐号,
# 使用 user1 帐号执行查询, 返回一个 json 结果集,
# 到此为止服务器搭建完成; 
# `hfc-key-store` 目录中有创建用户的公钥 (在用户名文件中)
# 和私钥 (signingIdenitity 字段对应的 `-priv` 文件中)
#
node enrollAdmin.js
node registerUser.js
node query.js
```


参考:

[安装前的准备](http://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

[构建第一个区块链网络](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html)

[第一个应用程序](http://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html)