# 区块链

```javascript
var bc = require('chain');
```

在配置文件中开启区块链服务器方可使用.


# 方法

## bc.create(string: chainName, string: channelName, string: consensusExp, KeyPair[]: keys)

创建一个链


## Chain bc.open(string: expression)

打开一个链进行操作, 链首先要在区块链管理中创建,
如果授权许可错误会抛出异常. 返回打开的链对象.

expression: 该表达式有以下用法:   
  1. 可以用 id 打开, 参数使用 'id://ID的值' 格式;  
  2. 用名称打开, 参数使用 'name://名称' 格式.  


## KeyPair bc.generateKeyPair()

生成随机密钥对


# class KeyPair

## publicKey

公钥字符串

## privateKey

私钥字符串


# class Chain

对链进行操作.
[Bytes 类说明](docs/api-bytes.md)

## Bytes genesisKey()

返回创世区块的 key

## Bytes lastBlockKey()

返回最后一个区块的 key

## Bytes worldState()

世界状态 hash.

## int size()

链长度

## Block search(string: key), Block search(Bytes: key)

查询并返回 key 指定的区块; 找不到 key 指定的块返回 null;
当参数是 string 类型时, 应该使用 base64url 编码.

## Bytes push(String data)

生成新的区块并加入区块链, 并返回区块的 key.


# class Block

已经在链上的块对象

## key : Bytes

块的主键

## hash : Bytes

块的 hash.

## previousHash : Bytes

前一个块的 hash

## previousKey : Bytes

前一个块的 key

## sign : Bytes

当前块的签名

## data : String

块的数据

## create : Date

块的生成时间

## userid : String

生成块的用户

## type : int

块类型

1. 创世区块 
2. 数据块
3. 加密数据块
4. 链码块
5. 消息块

## chaincodeKey : Bytes

生成该块的链码块的 key.