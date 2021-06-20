# 键值模块

全局模块, 在脚本中立即可用.

注: *部分方法仅为兼容性而存在, 可用 js 自身 api 替换, 不再另行文档.


# API

## Map map.syncMap()

返回一个 Map 该对象其中的属性可以在多个模块/接口之间共享, 而不会导致死锁或崩溃.  
接口参考: [Map](https://docs.oracle.com/javase/7/docs/api/java/util/Map.html)


## Map map.weakSyncMap()

返回一个 Map 该对象其中的属性可以在多个模块/接口之间共享, 而不会导致死锁或崩溃.
map 中的条目将在其键不再正常使用时自动删除.
适合用在对象缓存上.  
接口参考: [Map](https://docs.oracle.com/javase/7/docs/api/java/util/Map.html)


### map.get(object, key) *
### map.put(object, key, val) *
### map.putAll(map1, map2) *
### map.remove(object, key) *
### map.containsKey(object, key) *
### map.size(object) *

# Class Map

## void clear()

从此映射中删除所有映射

## Object get(string:key)

返回指定键映射到的值，或者null如果此映射不包含键的映射。

## boolean isEmpty()

如果此映射不包含任何键值映射，则返回true。

## Object put(string: key, Object: value)

将指定值与此映射中的指定键相关联（可选操作）。  
返回与key关联的先前值， 如果没有key 的映射，则为null。

## Object remove(string: key)

如果存在，则从此映射中删除键的映射, 并返回它.

## Number size()

返回此映射中键值映射的数量。

## boolean containsKey(string: key)

如果此映射包含指定键的映射，则返回true。

## boolean containsValue(Object: value)

如果此映射将一个或多个键映射到指定值，则返回true。