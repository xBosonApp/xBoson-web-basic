# MongoDB 客户端

文件系统需要引入 require 方可使用.

MongoDB 命令详细说明[参考这里](https://docs.mongodb.com/manual/reference/method/)


# 引入代码


```javascript
var mongodb = require('mongodb');
```


# API

示例代码片段中的对象定义参考其他示例片段.

## mongodb.connect(url)

返回客户端连接对象 Client, [Mongodb URL 链接参数](https://docs.mongodb.com/manual/reference/connection-string/)

```javascript
// 使用用户名密码, 并且连接集群
var client = mongodb.connect('mongodb://username:password@localhost:27017,localhost:27018/dbname?replicaSet=foo');
// 单机无密码
var client = mongodb.connect("mongodb://localhost");
// 连接到平台数据源
var client = mongodb.connect("source://source_id");
```

## mongodb.newObjectId(string: id)

构造 ObjectId 对象的实例

[什么是 ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/)


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


## Database.docs(), Database.all()

返回所有可用文档列表

```javascript
var names = db.all();
for (var i in names) {
  // do something
  var name = names[i];
}
```


# Collection 文档数据集对象

## void Collection.insert(array|object:document)

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

## void Collection.insertMany(array:documentList)

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


## void Collection.insertOne(object:document)

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
phone.deleteMany([{
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


## Collection.count(object:query)

查询符合条件的文档数量.


## Collection.find()

查询所有文档


## Collection.find(int: pageNum, int: pageSize)

分页查询所有文档, pageNum 从 1 开始.


## Collection.find(object:query)

条件查询文档, 返回数组, 无参数调用返回所有文档

```javascript
//
// 用主键查询文档, 返回数组
//
var findx = coll.find({ _id : 'jym-PC-1514958286201' });
```


## Collection.find(object:query, int: pageNum, int: pageSize)

带有分页功能 pageNum 从 1 开始.


## Collection.find(object: query, object: projection)

条件查询文件, 返回数组, projection 指定返回的文档字段, _id 字段总是返回.

```javascript
//
// 查询文档, 返回的字段包括: {_id, item, qty}
//
var findx = coll.find( { qty: { $gt: 25 } }, { item: 1, qty: 1 } );
```


## Collection.find(object: query, object: projection, int: pageNum, int: pageSize)

带有分页功能. pageNum 从 1 开始.


## Cursor Collection.find2(object: query)

查询文档, 返回一个游标用于对结果集进行操作.

```javascript
var list = collection.find2({_id:'xxx'}).page(sys).sort({_id:-1}).toArray();
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


# Cursor 对象

结果集游标, 其中的方法可以串联操作

```javascript
// 串联操作
cursor.skip(10).limit(20);
```

## projection(object)

字段过滤, 设置一个文档，描述要返回的所有匹配文档的字段.

## filter(object)

设置查询过滤器以应用于查询

## limit(number)

限制结果集数量

## skip(number)

结果集跳过一些文档

## maxTimeMS(number:MILLI_SECONDS)

设置此操作在服务器上的最大执行时间(毫秒)

## maxAwaitTimeMS(number:MILLI_SECONDS)

服务器等待新文档以满足可尾光标查询的最长时间

## sort(object)

设置要应用于查询的排序条件

## partial(boolean)

true 如果一个或多个分片不可达（而不是引发错误），则从分片集群中获得部分结果.

## hint(object)

设置要使用哪个索引的提示

## max(object)

设置特定索引的排他上限

## min(object)

设置特定索引的最小包含下限

## returnKey(boolean)

修改光标以返回索引键而不是文档

## showRecordId(boolean)

通过将字段添加$recordId到匹配的文档来修改查询的输出。$recordId是唯一标识集合中文档的内部关键字

## snapshot(boolean)

设置快照

## page(sys)

将 sys 对象传递到该函数, 取出 pagenum 和 pagesize 作为分页参数,
该方法是 limit  和 skip 的简便操作; 如果没有分页参数或参数无效, 
则抛出异常.

## toArray()

该方法返回查询结果文档对象数组.