# 智能上下文配置

让程序根据当前场景使用不同的配置文件, 且不需要修改任何代码.

在编写程序代码前, 首先规划应用使用的配置, 并在平台管理画面上提前配置好.

*在管理画面上首先删除(多个场景下的)配置文件内容, 再删除配置文件才能保证数据彻底删除.*

```js
var cfg = require("config");
var programConfig = cfg.get("user-config");
if (!programConfig) {
  cfg.create({
    'mode': cfg.MODE_ORG,
    'name': "user-config",
    'desc': "DEMO",
    'create_time': new Date(),
  });
  cfg.putTemplate('user-config', {
    'id'  : cfg.TYPE_STRING,
    'name': cfg.TYPE_STRING,
  });
  cfg.setDesc('user-config', {
    'id'   : "用户索引",
    'name' : "用户名称",
  });
  programConfig = {/* default config */};
}
console.log(programConfig);
```

# API


## Object get(String name)

根据配置文件的模式返回配置的内容.

如果配置文件不存在或没有配置数据返回空对象.


```js
var cfg  = require("config");
var user = cfg.get('user-config');
var id   = user.id;
var name = user.name;
```

## void set(String name, Object setting)

根据配置文件的模式设置配置的内容.

如果配置文件不存在抛出异, 这将覆盖旧的数据.


## void create(Object meta)

创建空的配置文件, meta 为配置元数据, 参数为:

```js
{ 'mode'        : 模式, 数字
  'name'        : 名称, 字符串, 用于打开配置, 不可重复
  'desc'        : 描述, 字符串, 可以空
  'create_time' : 创建时间, 字符串
}
```

不能创建相同 name 的配置文件, 会抛出异常; 
平台上可通过画面直接创建配置文件, 通常不需要在代码中调用该方法.


## void remove(String name)

删除配置文件, 只有创建配置文件的用户有权删除, 否则会抛出异常.
平台上可通过画面直接管理配置文件, 通常不需要在代码中调用该方法.


## void putTemplate(String name, Object template)

设置配置模板, name 对应的配置文件的配置模板总是唯一的, 
template[k,v] 中 k 是配置属性名称, v 是数据类型, 
配置模板在当前环境没有配置数据时, 为配置提供指导.

这将覆盖旧的配置模板, 如果配置文件不存在抛出异.

```js
var cfg = require("config");
cfg.putTemplate('user-config', {
  'id'  : cfg.TYPE_STRING,
  'name': cfg.TYPE_STRING,
});
```


## Object getTemplate(String name)

返回配置模板, 如果配置文件不存在抛出异.


## void setDesc(String name, Object attrDesc) 

设置配置文件属性说明, 在用户进行配置时在画面上显示这些说明.

```js
var cfg = require("config");
cfg.setDesc('user-config', {
  'id'   : "用户索引",
  'name' : "用户名称",
});
```


# 常量 / 模式

返回的配置文件取决于选择的模式和当前的场景, 
当场景切换, 配置文件也会切换.

```js
var cfg = require("config");
cfg.MODE_USER
```

## `MODE_USER` 用户模式

当前登录用户有自己的配置文件, 管理画面只能设置用户自己的配置文件.

## `MODE_ORG` 机构模式

不同的机构有自己的配置文件, 管理画面在切换机构后可以修改机构的配置文件.
一个应用在多个机构中使用不同的配置文件适用该模式.

## `MODE_APP` 应用模式

不同的应用有自己的配置文件, 管理画面无法设置应用的配置文件, 
应用自行管理自己的配置文件, 两个不同的应用引用一个配置文件且配置不同时适用该模式.

## `MODE_GLOBAL` 全局模式

任何情况下总是返回唯一的配置文件, 管理画面可以管理全局配置文件,
不要在该模式下存储安全敏感的数据.

## `MODE_DEV` 运行环境

开发环境和生产环境使用不同的配置文件, 通过切换开发/生产环境, 
管理画面可以管理运行环境配置文件.

## `MODE_ORG_DEV` 运行环境 + 机构模式

在不同机构的开发环境和生产环境使用不同的配置文件, 
通过切换机构/开发/生产环境, 管理画面可以修改对应的配置文件.



# 常量 / 数据类型

数据类型用于创建配置模板

## `TYPE_STRING`

字符串类型

## `TYPE_NUMBER`

数字类型

## `TYPE_BOOL`

布尔类型

## `TYPE_REMOVE`

删除该配置