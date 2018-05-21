# DB 查询模块

全局模块, 在脚本中立即可用.

所有服务 API 都将使用这个模块与数据库交换数据.

在查询时, 默认连接机构自己的数据库, 无需指定数据库名.
平台中的应用将可以同时查询平台数据库和应用所在机构的数据库.

脚本上下文由系统维护, 每个脚本的每次请求都有一个独立的脚本上下文.


# 可用 API


## sql.query(string:sql, array:paramBind [, string:key])

查询 sql 文, 绑定查询参数, 并将查询结果加入 '应答数据集'.

参数:

* sql: sql 文, 可以有 '?' 待绑定参数.
* paramBind: 绑定参数数组, 与 sql 文中的 '?' 一一对应.
* key: '应答数据集' 键名.


```javascript
var sqlSel = "SELECT COUNT(*) CNT FROM transferLog WHERE POSITIONID = ? ";
var paramSel = ["00"];
var queryCount = sql.query(sqlSel, paramSel, "key2");
var selResult = sys.result["key2"];
```


## sql.queryPaging(string:sql, array:paramBind, int:pageNum, int:pageSize [, stirng:key, int:totalCount])

带有分页功能的查询, 其他与 sql.query 相同.
除了绑定 key 到应答数据集, 还会绑定一个 key+'\_count' 变量到应答数据集.
若通过 sys.setRetData 将 key 返回给客户端, key+'\_count' 也会一起返回给客户端.

参数:

* sql: sql 文, 可以有 '?' 待绑定参数.
* paramBind: 绑定参数数组, 与 sql 文中的 '?' 一一对应.
* pageNum: 当前页序号, 从 1 开始.
* pageSize: 一页的行数量.
* key: '应答数据集' 键名, 和隐含键名 key + '\_count'
* totalCount: 若提供总记录数, 可以省去一次查询总记录数的开销.


```javascript
var sqlPaging = "SELECT * FROM transferLog WHERE POSITIONID = ? AND HOSPUNITORGCODE = ? ";		
var paramPaging = ["00", "some"];
var queryPagingCount = sql.queryPaging(sqlPaging, paramPaging, 1, 3, "key1");
var resultList = sys.result.key1;	
var resultTotalCount = sys.result.key1_count;
```


## sql.update(string:sql, array:paramBind [, string:flag])

执行更新 sql 文, 返回受影响的数据数量.

参数:

* sql: sql 文, 可以有 '?' 待绑定参数.
* paramBind: 绑定参数数组, 与 sql 文中的 '?' 一一对应.
* flag: 是否提交事务标记，"0"：提交，"1"：不提交，默认为提交"0"，不提交时后续可使用 sql.commit() 方法进行提交操作

```javascript
var sqlIns = "INSERT INTO transferLog (POSITIONID, HOSPUNITORGCODE, BUSSID, TABLENAME, STATUS, CREATEDATE, EXTEND1) VALUES ('00', 'Dean', 'BUSSID', 'TABLENAME', '0', str_to_date(?, '%Y-%m-%d'), ?)";
var paramIns = ["2017-12-27", "1000"];
var updatedcount = sql.update(sqlIns, paramIns, "0");
```


## sql.updateBatch(string:sql, array:paramsBind [, string:flag])

用不同的参数执行同一个 sql 文. 迭代 paramsBind 每次执行一个查询.

参数:

* sql: sql 文, 可以有 '?' 待绑定参数.
* paramBind: 绑定参数数组的数组; 与 sql 文中的 '?' 一一对应.
* flag: 是否提交事务标记，"0"：提交，"1"：不提交，默认为提交"0"，不提交时后续可使用 sql.commit() 方法进行提交操作


```javascript
var sqlIns = "INSERT INTO transferLog (POSITIONID, HOSPUNITORGCODE, BUSSID, TABLENAME, STATUS, CREATEDATE, EXTEND1) VALUES ('00', 'Dean', 'BUSSID', 'TABLENAME', '0', str_to_date(?,'%Y-%m-%d'), ?) ";
var paramIns = [["2014-3-20", "aaa"],["2014-3-20", "aaa"]];
var updatedcount = sql.updateBatch(sqlIns, paramIns, "0");
```


## sql.metaData(string:sql)

执行查询, 但不请求数据, 只返回结果集的元数据.

```javascript
// 执行后返回
[
  { "ColumnLabel" : 列的别名,
    "ColumnName" : 列名,
    "ColumnTypeName" : 列的SQL类型名称,
    "Precision" : 类型的长度,
    "Scale" : 类型的精度,
    "TableName" : 列所属的表名,
    "SchemaName" : 列所属的Schema名,
    "CatalogName" : 列所属的Catalog名,
  }
  ...更多
]	
```


## sql.commit()

递交事务


## sql.rollback()

回滚事务


## sql.currentDBTimeString()

返回 db 服务器当前时间字符串, 格式为 "yyyy-MM-dd HH:mm:ss"


## sql.connection()

切换当前脚本上下文的数据源为当前机构系统数据源.


## sql.connection(string:connectId)

切换当前脚本上下文的数据源为指定的数据源.

参数: 

* connectId: 在平台上注册的数据源 id


## sql.connection(stirng:url, string:username, string:password)

切换当前脚本上下文的数据源为指定的数据源.

参数:

* url: jdbc 连接 url.
* username: 数据库用户
* password: 数据库密码


## sql.dbType()

返回当前脚本上下文数据源类型, 返回的是字符串.

DB 类型代码，"01" MySQL, "02" SQLServer, "03" Oracle.


## sql.msAccessConnection()

未实现; 该方法不安全, 且在 linux 环境中无效.