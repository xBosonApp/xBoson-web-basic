# 二进制缓冲区

Buffer 类是一个全局变量, 在脚本中立即可用.

或使用 require('buffer').Buffer 引入.


# 类方法

## Buffer.alloc(int:size [, byte:fill, string:encoding])

使用指定的参数创建缓冲区实例.

* size: 缓冲区容量
* fill: 用该值填充整个缓冲区, 默认 0.
* encoding: 转换为字符串时使用的编码, 默认 'utf8'.


## Buffer.allocUnsafe(int:size)

Buffer.alloc 的别名.


## Buffer.allocUnsafeSlow(int:size)

Buffer.alloc 的别名.


## Buffer.from(byte[]:array [, int:offset, int:length])

使用字节数组创建缓冲区实例

* array: 字节数组
* offset: 字节数组片段的开始偏移, 默认 0
* length: 字节数组内容长度, 默认为全部.


## Buffer.from(string:content [, string:encoding])

用字符串创建缓冲区, 并指定字符串的编码.

* content: 字符串, 将被转换为缓冲区
* encoding: 编码名称, 默认 utf8


## Buffer.from(buffer:other)

创建二进制缓冲区的副本.


## Buffer.from(ArrayBuffer)

使用 javascript 底层 ArrayBuffer 对象创建二进制缓冲区.


## Buffer.byteLength(string:str [, stirng:encoding]) 

返回字符串底层字节长度.


## Buffer.compare(buffer:b1, buffer:b2)

参考 b1.compare(b2).


## Buffer.concat(buffer[]:array [, int:totalLength])

将多个缓冲区内容合并为一个缓冲区, 返回合并后的缓冲区副本.

* array: 缓冲区数组
* totalLength: 缓冲区最大长度, 默认为所有缓冲区的总长度.


## Buffer.isBuffer(object:o)

如果对象是缓冲区返回 true.


## Buffer.isEncoding(string:name)

如果 encoding 是一个支持的字符编码则返回 true，否则返回 false 


# 实例方法

实例通过类方法来创建.

```javascript
var buf = Buffer.alloc(10);
```

## buf[index]

索引操作符 [index] 可用于获取或设置 buf 中指定 index 位置的八位字节。 这个值指向的是单个字节，所以合法的值范围是的 0x00 至 0xFF（十六进制），或 0 至 255（十进制）。

越界访问将抛出异常.


## buf.fill(value[, int:offset[, int:end]][, string:encoding])

* value <string> | <Buffer> | <integer> 用来填充 buf 的值。
* offset <integer> 开始填充 buf 前要跳过的字节数。默认: 0。
* end <integer> 结束填充 buf 的位置（不包含）。默认: buf.length。
* encoding <string> 如果 value 是一个字符串，则这是它的字符编码。默认: 'utf8'。

返回: <Buffer> buf 的引用。

如果未指定 offset 和 end，则填充整个 buf。 这个简化使得一个 Buffer 的创建与填充可以在一行内完成。


## buf.compare(target [, targetStart, targetEnd, sourceStart, sourceEnd])

* target <Buffer> | <Uint8Array> 要比较的 Buffer 或 Uint8Array。
* targetStart <integer> target 中开始对比的偏移量。 默认: 0
* targetEnd <integer> target 中结束对比的偏移量（不包含）。 当 targetStart 为 undefined 时忽略。 默认: target.length
* sourceStart <integer> buf 中开始对比的偏移量。 当 targetStart 为 undefined 时忽略。 默认: 0
* sourceEnd <integer> buf 中结束对比的偏移量（不包含）。 当 targetStart 为 undefined 时忽略。 默认: buf.length

返回: <integer>

比较 buf 与 target，返回表明 buf 在排序上是否排在 target 之前、或之后、或相同。 对比是基于各自 Buffer 实际的字节序列。

* 如果 target 与 buf 相同，则返回 0 。
* 如果 target 排在 buf 前面，则返回 1 。
* 如果 target 排在 buf 后面，则返回 -1 。


## buf.copy(target [, targetStart, sourceStart, sourceEnd])

* target <Buffer> | <Uint8Array> 要拷贝进的 Buffer 或 Uint8Array。
* targetStart <integer> target 中开始拷贝进的偏移量。 默认: 0
* sourceStart <integer> buf 中开始拷贝的偏移量。 当 targetStart 为 undefined 时忽略。 默认: 0
* sourceEnd <integer> buf 中结束拷贝的偏移量（不包含）。 当 sourceStart 为 undefined 时忽略。 默认: buf.length

返回: <integer> 被拷贝的字节数。

拷贝 buf 的一个区域的数据到 target 的一个区域，即便 target 的内存区域与 buf 的重叠。


## buf.equals(otherBuffer)

* otherBuffer <Buffer> 要比较的 Buffer 或 Uint8Array。

返回: <boolean>

如果 buf 与 otherBuffer 具有完全相同的字节，则返回 true，否则返回 false。


## buf.toString([encoding[, start[, end]]])

* encoding <string> 解码使用的字符编码。默认: 'utf8'
* start <integer> 开始解码的字节偏移量。默认: 0
* end <integer> 结束解码的字节偏移量（不包含）。 默认: buf.length

返回: <string>

根据 encoding 指定的字符编码解码 buf 成一个字符串。 start 和 end 可传入用于只解码 buf 的一部分。

如果无参数调用, 会 dump buffer 的部分内容.


## buf.entries()

返回: <Iterator>

从 buf 的内容中，创建并返回一个 [index, byte] 形式的迭代器。


## buf.keys()

返回: <Iterator>

创建并返回一个包含 buf 键名（索引）的迭代器。


## buf.indexOf(value[, byteOffset][, encoding])

* value <string> | <Buffer> | <Uint8Array> | <integer> 要搜索的值
* byteOffset <integer> buf 中开始搜索的位置。默认: 0
* encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'

返回: <integer> buf 中 value 首次出现的索引，如果 buf 没包含 value 则返回 -1

如果 value 是：

* 字符串，则 value 根据 encoding 的字符编码进行解析。
* Buffer 或 Uint8Array，则 value 会被作为一个整体使用。如果要比较部分 Buffer，可使用 buf.slice()。
* 数值, 则 value 会解析为一个 0 至 255 之间的无符号八位整数值。


## buf.lastIndexOf(value[, byteOffset][, encoding])

* value <string> | <Buffer> | <Uint8Array> | <integer> 要搜索的值
* byteOffset <integer> buf 中开始搜索的位置。 默认: buf.length- 1
* encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'

返回: <integer> buf 中 value 最后一次出现的索引，如果 buf 没包含 value 则返回 -1

与 buf.indexOf() 类似，除了 buf 是从后往前搜索而不是从前往后。


## buf.includes(value[, byteOffset][, encoding])

* value <string> | <Buffer> | <integer> 要搜索的值
* byteOffset <integer> buf 中开始搜索的位置。默认: 0
* encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'

返回: <boolean> 如果 buf 找到 value，则返回 true，否则返回 false

相当于 buf.indexOf() !== -1。


## buf.slice([start[, end]])

* start <integer> 新建的 Buffer 开始的位置。 默认: 0
* end <integer> 新建的 Buffer 结束的位置（不包含）。 默认: buf.length

返回: <Buffer>

返回一个指向相同原始内存的新建的 Buffer，但做了偏移且通过 start 和 end 索引进行裁剪。

注意，修改这个新建的 Buffer 切片，也会同时修改原始的 Buffer 的内存，因为这两个对象所分配的内存是重叠的。


## buf.toJSON()

返回 buf 的 JSON 格式。 

当字符串化一个 Buffer 实例时，JSON.stringify() 会隐式地调用该函数。


## buf.swap16()

返回: <Buffer> buf 的引用

将 buf 解析为一个无符号16位的整数数组，并且以字节顺序原地进行交换。 如果 buf.length 不是2的倍数，则抛出 RangeError 错误。


## buf.swap32()

返回: <Buffer> buf 的引用

将 buf 解析为一个无符号32位的整数数组，并且以字节顺序原地进行交换。 如果 buf.length 不是4的倍数，则抛出 RangeError 错误。


## buf.swap64()

返回: <Buffer> buf 的引用

将 buf 解析为一个64位的数值数组，并且以字节顺序原地进行交换。 如果 buf.length 不是8的倍数，则抛出 RangeError 错误。


## buf.readDoubleLE(offset), buf.readDoubleBE(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 8。

返回: <number>

用指定的字节序格式（readDoubleBE() 返回大端序，readDoubleLE() 返回小端序）从 buf 中指定的 offset 读取一个64位双精度值。


## buf.readFloatBE(offset), buf.readFloatLE(offset)

offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <number>

用指定的字节序格式（readFloatBE() 返回大端序，readFloatLE() 返回小端序）从 buf 中指定的 offset 读取一个32位浮点值。


## buf.readInt8(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。

返回: <integer>

从 buf 中指定的 offset 读取一个有符号的8位整数值。
从 Buffer 中读取的整数值会被解析为二进制补码值。


## buf.readInt16BE(offset), buf.readInt16LE(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。

返回: <integer>

用指定的字节序格式（readInt16BE() 返回大端序，readInt16LE() 返回小端序）从 buf 中指定的 offset 读取一个有符号的16位整数值。
从 Buffer 中读取的整数值会被解析为二进制补码值。


## buf.readInt32BE(offset), buf.readInt32LE(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <integer>

用指定的字节序格式（readInt32BE() 返回大端序，readInt32LE() 返回小端序）从 buf 中指定的 offset 读取一个有符号的32位整数值。
从 Buffer 中读取的整数值会被解析为二进制补码值。


## buf.readIntBE(offset, byteLength), buf.readIntLE(offset, byteLength)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
* byteLength <integer> 要读取的字节数。必须满足：0 < byteLength <= 6。

返回: <integer>

从 buf 中指定的 offset 读取 byteLength 个字节，且读取的值会被解析为二进制补码值。 最高支持48位精度。


## buf.readUInt8(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。

返回: <integer>

从 buf 中指定的 offset 读取一个无符号的8位整数值。


## buf.readUInt16BE(offset), buf.readUInt16LE(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。

返回: <integer>

用指定的字节序格式（readUInt16BE() 返回大端序，readUInt16LE() 返回小端序）从 buf 中指定的 offset 读取一个无符号的16位整数值。


## buf.readUInt32BE(offset), buf.readUInt32LE(offset)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <integer>

用指定的字节序格式（readUInt32BE() 返回大端序，readUInt32LE() 返回小端序）从 buf 中指定的 offset 读取一个无符号的32位整数值。


## buf.readUIntBE(offset, byteLength), buf.readUIntLE(offset, byteLength)

* offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
* byteLength <integer> 要读取的字节数。必须满足：0 < byteLength <= 6。

返回: <integer>

从 buf 中指定的 offset 读取 byteLength 个字节，且读取的值会被解析为无符号的整数。 最高支持48位精度。


## buf.write(string[, offset[, length]][, encoding])

* string <string> 要写入 buf 的字符串。
* offset <integer> 开始写入 string 前要跳过的字节数。默认: 0。
* length <integer> 要写入的字节数。默认: buf.length - offset。
* encoding <string> string 的字符编码。默认: 'utf8'。

返回: <integer> 写入的字节数。

根据 encoding 的字符编码写入 string 到 buf 中的 offset 位置。 length 参数是写入的字节数。 如果 buf 没有足够的空间保存整个字符串，则只会写入 string 的一部分。 只部分解码的字符不会被写入。


## buf.writeDoubleBE(value, offset), buf.writeDoubleLE(value, offset)

* value <number> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 8。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeDoubleBE() 写入大端序，writeDoubleLE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的64位双精度值。 当 value 不是一个64位双精度值时，反应是不确定的。


## buf.writeFloatBE(value, offset), buf.writeFloatLE(value, offset)

* value <number> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeFloatBE() 写入大端序，writeFloatLE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的32位浮点值。 当 value 不是一个32位浮点值时，反应是不确定的。


## buf.writeInt8(value, offset)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。

返回: <integer> offset 加上写入的字节数。

写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的8位整数。 当 value 不是一个有符号的8位整数时，反应是不确定的。


## buf.writeInt16BE(value, offset), buf.writeInt16LE(value, offset)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeInt16BE() 写入大端序，writeInt16LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的16位整数。 当 value 不是一个有符号的16位整数时，反应是不确定的。


## buf.writeInt32BE(value, offset), buf.writeInt32LE(value, offset)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeInt32BE() 写入大端序，writeInt32LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的32位整数。 当 value 不是一个有符号的32位整数时，反应是不确定的。


## buf.writeIntBE(value, offset, byteLength), buf.writeIntLE(value, offset, byteLength)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
* byteLength <integer> 要写入的字节数，必须满足：0 < byteLength <= 6。

返回: <integer> offset 加上写入的字节数。

写入 value 中的 byteLength 个字节到 buf 中指定的 offset 位置。 最高支持48位精度。 当 value 不是一个有符号的整数时，反应是不确定的。


## buf.writeUInt8(value, offset[, noAssert])

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。

返回: <integer> offset 加上写入的字节数。

写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的8位整数。 当 value 不是一个无符号的8位整数时，反应是不确定的。


## buf.writeUInt16BE(value, offset), buf.writeUInt16LE(value, offset)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeUInt16BE() 写入大端序，writeUInt16LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的16位整数。 当 value 不是一个无符号的16位整数时，反应是不确定的。


## buf.writeUInt32BE(value, offset), buf.writeUInt32LE(value, offset)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。

返回: <integer> offset 加上写入的字节数。

用指定的字节序格式（writeUInt32BE() 写入大端序，writeUInt32LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的32位整数。 当 value 不是一个无符号的32位整数时，反应是不确定的。


## buf.writeUIntBE(value, offset, byteLength), buf.writeUIntLE(value, offset, byteLength)

* value <integer> 要写入 buf 的数值。
* offset <integer> 开始写入前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
* byteLength <integer> 要写入的字节数，必须满足：0 < byteLength <= 6。

返回: <integer> offset 加上写入的字节数。

写入 value 中的 byteLength 个字节到 buf 中指定的 offset 位置。 最高支持48位精度。 当 value 不是一个无符号的整数时，反应是不确定的。


## buffer.transcode(source, fromEnc, toEnc)

未实现, 调用将抛出异常.