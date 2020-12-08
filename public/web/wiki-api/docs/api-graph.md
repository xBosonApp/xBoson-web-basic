# graph

图数据库

```js
var graph = require("graph");
```

# API

## Session connect(string: uri[, string: username, string: password])

连接到数据库, 返回 Session 类的实例用于执行查询.

可用的 uri 协议前缀:

* `bolt://localhost:7687` 用 bolt 协议连接 neo4j 数据库
* `neo4j://localhost:7687` 用 neo4j 协议连接 neo4j 数据库


# class Session

用于执行数据库操作的事务上下文, 该对象在离开当前脚本上下文后会自动关闭


## Result query(string: cql[, object: parameters])

执行一个查询, 返回结果集, 在支持的数据库上可用绑定参数参数.


## beginTransaction()

开始一个事务, 之后的所有更新数据查询都基于该事务整体递交或回滚.  
在不支持事务的数据库上调用会抛出异常


## commit()

递交事务, 不在事务中会抛出异常.


## rollback()

回滚事务, 不在事务中会抛出异常.


## close()

立即关闭当前数据库上下文. 允许多次调用.


# class Result

结果集迭代器.


## boolean hasNext()

如果有下一条记录返回 true, 迭代结果集时应该首先调用该方法


## Object next()

将迭代器指针指向下一条记录并返回, 迭代器初始化时指向第一条数据的前面.


## close()

立即关闭结果集