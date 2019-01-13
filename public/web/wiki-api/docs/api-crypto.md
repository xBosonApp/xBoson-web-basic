# 加密/解密模块

```javascript
var crypto = require('crypto');
```

# 方法

## CipherJs createCipher(String algorithm, String pass)

使用指定的算法和密钥创建加密对象. algorithm 算法可以使用: `aes`, `des`

```js
var cc = crypto.createCipher('aes', ps);
var all = [];
all.push(cc.update('123'));
all.push(cc.update('abc'));
all.push(cc.end());
//
// cdata 是加密后的字节缓冲区
//
var cdata = sys.joinBytes(all);
```

## CipherJs createDecipher(String algorithm, String pass)

使用指定的算法和密钥创建解密对象. algorithm 算法可以使用: `AES`, `DES`, `PBE`

```js
var cd = crypto.createDecipher('aes', ps);
cd.update(cdata);
//
// data 是解密后的原始字节缓冲区
//
var data = cd.end();
```


## Hash createHash(String algorithm)

创建 Hash 用于校验, 见 [Hash 类说明](docs/api-digest.md), 
algorithm 可以使用: `SHA-1`, `SHA-224`, `SHA-256`, `SHA-384`, `SHA-512`, `md5`, `md2`.

```js
var hash = crypto.createHash('sha-256');
hash.update('123');
hash.update('abc');
//
// result 是校验和数据字节缓冲区
//
var result = hash.digest();
```


# Class CipherJs

加密/解密对象, [Bytes 类说明](docs/api-bytes.md)

## Bytes update(String)

将字符串的底层字节数组做加密, 并返回加密数据的一个窗口数据, 
如果数据不足以填满窗口则返回空长度缓冲区.

## Bytes update(Bytes)

加密缓冲区数据.

## Bytes update(Buffer)

加密缓冲区数据.

## Bytes end()

终结加密过程, 并返回最终窗口数据.