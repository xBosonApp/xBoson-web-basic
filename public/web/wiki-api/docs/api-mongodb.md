# MongoDB 客户端

文件系统需要引入 require 方可使用.

MongoDB 命令详细说明参考[这里](https://docs.mongodb.com/manual/reference/method/)


# 引入代码


```javascript
var mongodb = require('mongodb');
```


# API

示例代码片段中的对象定义参考其他示例片段.

## mongodb.connect(url)

返回客户端连接对象 Client

```javascript
// 使用用户名密码, 并且连接集群
var client = mongodb.connect('mongodb://username:password@localhost:27017,localhost:27018/?replicaSet=foo');
// 单机无密码
var client = mongodb.connect("mongodb://localhost");
// 连接到平台默认配置的 mongodb
var client = mongodb.connect();
```


# Client 客户端连接对象

## Client.db(string:databaseName)

返回数据库对象 Database

```javascript
var db = client.db("test");
```


## Client.dbs(), Client.all()

返回数据库名称列表

```javascript
var names = client.dbs();
for (var i in names) {
  // do something
  var name = names[i];
}
```


# Database 数据库对象

## Database.collection(string:collectionName)

返回文档数据集 Collection.

```javascript
var phone = db.collection("phone");
```


## Database.all()

返回所有可用文档列表

```javascript
var names = db.all();
for (var i in names) {
  // do something
  var name = names[i];
}
```


# Collection 文档数据集对象

## Collection.insert(array|object:document)

将文档插入 DB, 如果参数是数组, 则插入多个文档.

```javascript
var hw_meta = {
  _id : 1,
  model: "M10",
  name: "HuaWi",
  site: "http://www.huawi.com/cn/",
};
phone.insert(hw_meta);
```

## Collection.insertMany(array:documentList)

插入多个文档到 DB.

```javascript
var i_many = [{
  _id  : 2,
  model: "HoneMi"
  name : "XioMi",
  site : "http://www.xiomi.cn"
}, {
  _id  : 3,
  model: "NX5",
  name : "MeZu",
  site : "http://www.mezu.com"
}];
phone.insertMany(i_many);
```


## Collection.insertOne(object:document)

```javascript
var hw_meta = {
  _id : 1,
  model: "Z10",
  name: "HuaWi",
  site: "http://www.huawi.com/cn/",
};
phone.insertOne(hw_meta);
```

插入一个文档到 DB.

## Collection.updateOne(object:filter, object:update [, object:options])

更新一个文档, 返回 UpdateResult 对象.

```javascript
phone.updateOne(
   { _id: 1 },
   {
     $set: { "name": "HuaWi-100", status: "update" },
     $currentDate: { lastModified: true }
   }
);
```

## Collection.updateMany(object:filter, object:update [, object:options])

更新多个符合条件的文档, 返回 UpdateResult 对象.

## Collection.replaceOne(object:filter, object:replacement [, object:options])

重写文档, 除了主键字段, 返回 UpdateResult 对象.

## Collection.deleteOne(object:filter [, object:options])

删除一个文档, 返回 DeleteResult 对象.

```javascript
phone.deleteOne({
  model: "BOOM8",
  name: "samsvng",
});
```

## Collection.deleteMany(object:filter [, object:options])

删除多个文档, 返回 DeleteResult 对象.

```javascript
phone.deleteOne([{
  model: "BOOM8",
  name: "samsvng",
}, {
  model: "BOOM7",
  name: "samsvng",
}]);
```

## Collection.createIndex(object:key [, object:options])

创建索引

```javascript
var index_name = phone.createIndex({
  name  : 1, 
  model : 1,
}, { 
  collation: { locale: "fr" } 
});
```

## Collection.dropIndex(object|string:index)

删除索引, 索引参数可以是索引名称字符串, 或索引定义文档.

```javascript
phone.dropIndex(index_name);
```

## Collection.getIndexes()

返回所有索引的数组.

```javascript
phone.getIndexes().forEach(function(index) {
  console.log("index:", index.name);
});
```

## Collection.count()

返回所有文档的数量.

## Collection.find([object:query])

条件查询文档, 返回数组, 无参数调用返回所有文档

```javascript
//
// 用主键查询文档, 返回数组
//
var findx = coll.find({ _id : 'jym-PC-1514958286201' });
```

## Collection.drop()

删除当前文档集合.


# UpdateResult 对象

## UpdateResult.getMatchedCount()

符合查询条件的文档数目

## UpdateResult.isModifiedCountAvailable()

如果返回 true, 则 getModifiedCount() 可用.

## UpdateResult.getModifiedCount()

被修改的文档数目


# DeleteResult 对象

## DeleteResult.getDeletedCount()

返回被删除的文档数量