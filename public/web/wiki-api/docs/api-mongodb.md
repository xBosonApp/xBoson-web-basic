# MongoDB 客户端

文件系统需要引入 require 方可使用.


# 引入代码


```javascript
var mongodb = require('mongodb');
```


# API

## mongodb.connect(url)

返回客户端连接对象

```javascript
// 使用用户名密码, 并且连接集群
var client = mongodb.connect('mongodb://username:password@localhost:27017,localhost:27018/?replicaSet=foo');
// 单机无密码
var client = mongodb.connect("mongodb://localhost");
```


# 客户端连接对象

## client.db(string:databaseName)

返回数据库对象

```javascript
var db = client.db("test");
```


## client.dbs(), client.all()

返回数据库名称列表

```javascript
var names = client.dbs();
for (var i in names) {
  // do something
  var name = names[i];
}
```


# 数据库对象

## db.collection(string:collectionName)

返回文档数据集

```javascript
var coll = db.collection("phone");
```


## db.all()

返回所有可用文档列表

```javascript
var names = db.all();
for (var i in names) {
  // do something
  var name = names[i];
}
```


# 文档数据集对象

## coll.count()

返回所有文档的数量.

## coll.find()

返回所有文档的数据集, 返回数组

## coll.find(object:where)

条件查询文档, 返回数组

```javascript
//
// 用主键查询文档, 返回数组
//
var findx = coll.find({ _id : 'jym-PC-1514958286201' });
```


## coll.createIndex()




