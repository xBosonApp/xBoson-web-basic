# 缓存模块

全局模块, 在脚本中立即可用.

每个机构的缓存都是隔离的.


# 可用 API

## cache.set(string:region, string:key, object:value, int:expiration)

将数据 value 缓存

参数:

* region: 分类
* key: 主键
* value: 值, 将被 JSON 化存储.
* expiration: 过期时间, 已经废弃!


```javascript
cache.set("regionName", "keyName", [["a"], ["b"]]);
```


## cache.get(string:region, string:key)

返回缓存的值, 未缓存过返回 null.

参数:

* region: 分类
* key: 主键

``` javascript
var v = cache.get("regionName", "keyName");
```


## cache.del(string:region, string:key)

删除已经缓存的数据.

参数:

* region: 分类
* key: 主键

```javascript
cache.del("regionName", "keyName");
```


## cache.delAll(string:region, array:keys)

删除多个已经缓存的数据.

参数:

* region: 分类
* key: 主键数组, 迭代删除 key 中对应的数据.

```javascript
cache.delAll("regionName", ["keyName1", "keyName2"]);
```


## cache.keys(string:region)

返回指定的 Region 中所有的 Key 的集合.

```javascript
var keys = cache.keys("regionName");
```


## cache.keys(string:region, Function:callback(index, key))

返回指定的 Region 中所有的 Key 的集合, 并用每个 key 调用 callback 函数, 返回 key 的总数量.

```javascript
cache.keys('regionName', function(index, key) {
  console.log(index, key);
});
```