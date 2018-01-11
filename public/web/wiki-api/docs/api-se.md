# SE 模块

全局模块, 在脚本中立即可用.

该模块仅在平台机构脚本环境中可用.


# API

## se.encodePlatformPassword(string:uid, string:date, string:password)

* uid: 用户名字符串
* date: 最后修改时间字符串, 用于加密密码的盐
* password: 密码明文
* 返回加密后的密码字符串

```javascrip
var ps = se.encodePlatformPassword("jym", "2017-01-11 10:47:00", "ps012345");
```


## se.setCache(string:region, string:key, object:val, int:exp)

* region: 缓存分组名称
* key: 缓存键名称
* value: 缓存值
* exp: 过期时间(废弃)

缓存值可以是 javascript 原始对象, 如 Object, 数组, 字符串, 数字, Bool, 其他自定义对象和函数都被忽略.


## se.getCache(string:region, string:key)

* region: 缓存分组名称
* key: 缓存键名称
* 返回缓存中的对象, 在缓存中找不到键对应的对象返回 null


## se.delCache(string:region [, string:key])

* region: 缓存分组名称
* key: 可选, 缓存键名称

如果只有 region 参数, 则删除整个分组中的所有数据;
如果两个参数都有效, 则只删除 key 中缓存的数据.


## se.delAllCache(string:region, string[]:keys)

* region: 缓存分组名称
* keys: 缓存键名称数组

删除多个 keys 对应的缓存值


## se.cacheKeys(string:region, string:pattern)

* region: 缓存分组名称
* pattern: 模式字符串
* 返回 key 的数组

该方法用于查询缓存分组中所有符合查询条件的 key, 并返回这些 key.

```javascript
//
// 返回分组中的所有 key
//
var all_key = se.cacheKeys("regionName", "*");
```


## se.dbType()

返回当前平台机构 DB 的数据库连接类型, 返回类型为字符串.

* "01" Mysql
* "02" SQLServer
* "03" Oracle
* "04" DB2
* "05" H3C MPP
* "06" 浪潮 DB
* "20" H2


## se.isPlatformOrg([string:org_id])

* org_id: 可选的, 机构字符串
* 返回 bool, 是平台机构返回 true

用于判断是否是平台机构, 参数不区分大小写.
如果没有 org_id 参数, 表示当前调用 api 的所在机构.


## se.localDb()

返回平台机构数据库连接信息对象.

```json
"返回的数据结构": {
  "url"     : "jdbc 连接字符串",
  "user"    : "数据库用户名",
  "password": "数据库密码",
  "dbtype"  : "数据库类型",
  "owner"   : "机构 id",
}
```

## se.query(string:sql, string[]:bindParm [, string:bindResult: bool:repleaseOrg])

* sql: 查询字符串, 可以有 '?' 进行参数绑定
* bindParm: 参数绑定
* bindResult: 可选, 将查询结果绑定到 '应答数据集'(sys 模块中), 默认为 'result'
* repleaseOrg: 可选, 必须为 false, 或忽略该参数, 仅为兼容而存在, 若需要替换 org 直接使用 sql 模块中的 query.
* 返回查询行数, int 类型.

用平台数据库执行 DB 查询.


## se.isAuthorizedBizModel(string:moduleCD)

* moduleCD: 模型主键
* 返回 bool

如果当前用户(所属的角色) 可以访问模型则返回 true.


## se.isAuthorizedUI(string:pageID)

* pageID: 页面(元素)主键
* 返回 bool

如果当前用户(所属的角色) 可以访问页面(元素) 则返回 true.


## se.logTopic(string:org, string:dataset, string:tableName, string:field)

该方法已经废弃


## se.reloadProperties()

该方法已经废弃



# 扩展 API 

这些方法仅在 2.0 平台中可用.

## se.decodeApiScript(string:code)

* code: 加密脚本字符串
* 返回 string

返回解密后的脚本, 去掉了前后 "<%..%>" 符号.


## se.encodeApiScript(string:code)

* code: 脚本源代码
* 返回 string

将 "<%..%>" 重新加上, 返回加密后的脚本.


## se.sendApiChange(string:content_id)

* content_id: 脚本 ID
* 返回 bool

发送脚本内容修改通知, 测试环境中对应的脚本将重新编译.
content_id 有效并发出通知返回 true.


## se.sendApiPublish(string:app, string:mod, string:api)

* app: 应用id
* mod: 模块id
* api: 脚本id
* 返回 bool

发送发布脚本通知, 生产环境中的对应脚本将被重新编译.