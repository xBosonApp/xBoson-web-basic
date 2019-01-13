# 断言

通常用于测试用例.
该模块需要引入方可使用.

```javascript
var assert = require('assert');
```


# API

## assert(object:value[, object:message])

assert.ok() 的别名


## assert.deepEqual(object:actual, object:expected[, object:message])

测试 actual 参数与 expected 参数是否深度相等。 原始值使用相等运算符（==）比较。


## assert.deepStrictEqual(object:actual, object:expected[, object:message])

与 assert.deepEqual() 大致相同，但有一些区别：

1. 原始值使用全等运算符（===）比较。Set 的值与 Map 的键使用 SameValueZero 比较。
1. 对象的原型也使用全等运算符比较。
1. 对象的类型标签要求相同。
1. 比较[对象包装器][]时，其对象和里面的值要求相同。


## assert.doesNotThrow(function:block[, RegExp|function:error][, object:message])

断言 block 函数不会抛出错误。

当 assert.doesNotThrow() 被调用时，它会立即调用 block 函数。

如果抛出错误且错误类型与 error 参数指定的相同，则抛出 AssertionError。 如果错误类型不相同，或 error 参数为 undefined，则抛出错误。


## assert.equal(object:actual, object:expected[, object:message])

使用相等运算符（==）测试 actual 参数与 expected 参数是否相等。


## assert.fail(object:actual, object:expected[, object:message[, string:operator[, function:stackStartFunction]]])

抛出 AssertionError。 如果 message 参数为空，则错误信息为 actual 参数 + operator 参数 + expected 参数。 如果只提供了 actual 参数与 expected 参数，则 operator 参数默认为 '!='。 如果提供了 message 参数，则它会作为错误信息，其他参数会保存在错误对象的属性中。 如果提供了 stackStartFunction 参数，则该函数上的栈帧都会从栈信息中移除.


## assert.ifError(object:value)

如果 value 为真，则抛出 value。 可用于测试回调函数的 error 参数。


## assert.notDeepEqual(object:actual, object:expected[, object:message])

测试 actual 参数与 expected 参数是否不深度相等。 与 assert.deepEqual() 相反。


## assert.notDeepStrictEqual(object:actual, object:expected[, object:message])

测试 actual 参数与 expected 参数是否不深度全等。 与 assert.deepStrictEqual() 相反。


## assert.notEqual(object:actual, object:expected[, object:message])

使用不等运算符（!=）测试 actual 参数与 expected 参数是否不相等。


## assert.notStrictEqual(object:actual, object:expected[, object:message])

使用不全等运算符（!==）测试 actual 参数与 expected 参数是否不全等。


## assert.ok(object:value[, object:message])

测试 value 是否为真值。 相当于 assert.equal(!!value, true, message)。

如果 value 不为真值，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。


## assert.strictEqual(object:actual, object:expected[, object:message])

使用全等运算符（===）测试 actual 参数与 expected 参数是否全等。


## assert.throws(function:block[, regExp|function:error][, object:message])

断言 block 函数会抛出错误。

error 参数可以是构造函数、正则表达式、或自定义函数。

如果指定了 message 参数，则当 block 函数不抛出错误时，message 参数会作为 AssertionError 的错误信息。



