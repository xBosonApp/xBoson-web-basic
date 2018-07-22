# 摘要算法

```javascript
var digest = require("digest");
```

# 方法

## digest.sha1()

返回 sha-1 算法的 hash 对象.

## digest.sha224()

返回 sha-224 算法的 hash 对象.

## digest.sha256()

返回 sha-256 算法的 hash 对象.

## digest.sha384()

返回 sha-384 算法的 hash 对象.

## digest.sha512()

返回 sha-512 算法的 hash 对象.

## digest.md5()

返回 md5 算法的 hash 对象.

## digest.md2()

返回 md2 算法的 hash 对象.

```javascript
var digest = require("digest");
var sha256 = digest.sha256();
sha256.update(lastBlockKey.toString());
sha256.update(randstr);
var hash = sha256.digest().bin();
```


# Class Hash

计算摘要的对象

## update(string: str)

使用字符串更新摘要

## update(integer: i)

使用整数更新摘要

## update(Bytes: b)

使用字节数组更新摘要

## Bytes digest()

返回摘要的字节数组


# Class Bytes

存储字节数组, 在必要时转换为 string, 方便进行 json 的转换.

## String toString()

转换为字符串, 使用 base64url 编码.

## Array bin()

返回原始数组.