# 智能上下文配置

让程序根据当前场景使用不同的配置文件, 且不需要修改任何代码.

在编写程序代码前, 首先规划应用使用的配置, 并在平台管理画面上提前配置好.

```js
var cfg = require("config");
cfg.create({
  'mode': cfg.MODE_ORG,
  'name': "ConfigName",
  'desc': "DEMO",
  'create_time': new Date(),
});
var programConfig = cfg.get("ConfigName");
console.log(programConfig.id, programConfig.name, programConfig);
```

# 模式

根据当前模式, 返回不同的上下文配置文件.

* 用户模式: 当前登录用户有自己的配置
* 应用模式: 不同的应用有自己的配置项
* 机构模式: 不同的机构有自己的配置项
* 全局模式: 任何情况下总是返回唯一的值


# API


## Object get(String name)

根据配置项的模式返回配置项的内容.

如果配置项不存在抛出异常, 如果配置项没有配置数据返回空对象.


## void set(String name, Object setting)

根据配置项的模式设置配置项的内容.

如果配置项不存在抛出异, 这将覆盖旧的数据.


## void create(Object meta)

创建空的配置项, meta 为配置项数据源, 参数为:

```js
{ 'mode'        : 模式, 数字 1-5
  'name'        : 名称, 字符串, 用于打开配置, 不可重复
  'desc'        : 描述, 字符串, 可以空
  'create_time' : 创建时间, 字符串
}
```

不能创建相同 name 的配置项, 会抛出异常; 
平台上可通过画面直接创建配置项, 通常不需要调用该方法.


## void remove(String name)

删除配置项, 只有创建配置项的用户有权删除, 否则会抛出异常.
平台上可通过画面直接管理配置项, 通常不需要调用该方法.


# 常量

## MODE_USER

用户模式

## MODE_ORG

机构模式

## MODE_APP

应用模式

## MODE_GLOBAL

全局模式