# 脚本兼容性

从 1.0 转换到 2.0 需要注意以下问题.


## 1.0 版脚本特性

基本符合 js 语法, 但 js 基础对象略不同;

对数组的操作借助于全局 list 模块, 对 map 的操作借助于 map 模块, 对日期的操作借助于 data 模块, 注意不要使用模块名称来定义变量名.

### 变量定义时的注意事项

不小心会定义与全局模块同名的变量, 这在 2.0 平台中是不允许的, 定义的变量将被忽略.

```javascript
//
// 这种定义在 1.0 版本中是正确的, 但语义与 sql 模块冲突, 不要这样做.
//
var sql = "";
```

### 迭代数组/对象

用 for 迭代一个数组时, 迭代的变量是数组的元素, 而在 js 中迭代的是数组的索引.

```javascript
var list = ['a', 'b', 'c'];
for (var d in list) {
  //
  // 每次迭代 d 分别为 'a', 'b', 'c'
  // 在标准 js 中应该是 0, 1, 2
  //
}
```

### 特殊语法

以 '@' 开始的表达式, 原意是要调用对象中的对应方法, 在 1.0 中应该使用 list 模块来操作, 在 2.0 的兼容模式中, 这种语法将被自动修正.

以 '~' 开始的属性表达式, 原意是要获取对象的虚拟属性, 这个特性在 2.0 中被废弃, 在 2.0 的兼容模式中, 这种语法将被自动修正.

特殊语法禁止在 2.0 脚本中出现, 平台将在更新的版本中删除这些特性.


```javascript
//
// 调用 params 中的 add 方法.
//
@params.add(status)
//
// menuid_array 对象的 size 属性.
//
menuid_array.~size
```


## 2.0 版脚本特性

2.0 脚本有两种模式, 一个是兼容模式, 一个是严格模式, 在兼容模式中, 为 1.0 写的脚本可以不加修正而正确执行, 但是脚本中包含与 javascript 语义不同的语句; 在严格模式中, 完全使用 javascript es5 语法, 所有 1.0 脚本的特殊语法都会在编译时报错; 所有新脚本应该以严格模式来编写, 这样将可以正确调用 2.0 脚本中新加入 api 和模块.


### 启用严格模式

在脚本的第一行写入 "use strict" 即可启用严格模式, 这也是 javascript 的约定.
启用了严格模式后所有语法参考 javascript.

```javascript
"use strict";
//
// 启用了严格模式
//
```
*2.0 脚本语法基于 javascript ES5*


Javascript 参考文档外链:

* [Mozilla 提供的英文参考文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
* [Mozilla 提供的中文参考文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
* [带有广告的中文参考文档](http://www.w3school.com.cn/js/index.asp).


### 多行字符串

在脚本中经常需要写入长 sql 文, 为 sql 文设置多行格式有助于书写和修改.

以单个反引号为开始, 另一个反引号为结束的字符串, 中间的所有字符(包括换行)都将合并为一个字符串, 合并后的字符串包含换行符; 注意不要在字符串中的任何位置使用反引号, 这将使字符串定义结束, 通常会引起编译错误; 这与 ES6 多行字符串类似, 但是不支持 ${...} 这样的变量绑定.

```javascript
var sql = `
  SELECT 
      role.roleid, api.appid, api.moduleid, api.apiid
  FROM
      sys_pl_role_release role,
      sys_pl_role_api_release api,
  WHERE
      role.roleid = api.roleid
      AND role.status = '1'
      AND api.status = '1'
`;
```