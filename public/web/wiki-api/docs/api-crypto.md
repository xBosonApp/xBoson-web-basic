# 加密/解密模块

```javascript
var crypto = require('crypto');
```

# 方法

## CipherJs createCipher(String algorithm, String pass)

使用指定的算法和密钥创建加密对象. algorithm 算法可以使用: 
`AES`, `DES`, `PBE`, `IDEA`, `SM2C1C2C3`, `SM2C1C3C2`(SM2 使用 SM3 作为摘要算法),
`SM4/ECB/PKCS5Padding`, `SM4/ECB/NoPadding`,

AES 加密示例:

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

SM2 C1C2C3 加密/解密示例:

```js
var crypto = require('crypto');
var key = crypto.ECKeyPair();
// 加密
var cc = crypto.createCipher('sm2c1c2c3', key.publicKey);
var all = [];
all.push(cc.update('123'));
all.push(cc.update('abc'));
all.push(cc.end());
// 加密后的缓冲区
var res = sys.joinBytes(all);
// 解密
var cd = crypto.createDecipher('sm2c1c2c3', key.privateKey);
all = [];
all.push(cd.update(res));
all.push(cd.end());
// 解密后的缓冲区
var src = sys.joinBytes(all);
```


## CipherJs createCipher(String algorithm, Bytes pass, Bytes iv)

该方法专门用来处理 CBC 算法, 其中 pass 参数必须是 16/32 字节固定长度,
如果密码是字符串, 应该使用 generateAesPass() 转换为 Bytes;
iv 是 16 字节固定长度, 使用 generateAesIV() 来生成;

可用 algorithm 列表: `AES/CBC/NoPadding`, `AES/CBC/PKCS5Padding`, `SM4/CBC/PKCS5Padding`, `SM4/CBC/NoPadding`

```js
var crypto = require('crypto');
// 用字符串密码生成 aes 密码
var ps = crypto.generateAesPass('abc');
// 生成随机 IV, IV 可用用明文和加密数据一起保存.
var iv = crypto.generateAesIV();
var cc = crypto.createCipher("AES/CBC/PKCS5Padding", ps, iv);
var buf = [];
buf.push(cc.update('123'));
buf.push(cc.update('abc'));
buf.push(cc.end());
// 生成最终加密字节缓冲区
var cdata = sys.joinBytes(buf);
```


## CipherJs createDecipher(String algorithm, String pass)

使用指定的算法和密钥创建解密对象. algorithm 算法见 `createCipher(...)`

```js
var cd = crypto.createDecipher('aes', ps);
cd.update(cdata);
//
// data 是解密后的原始字节缓冲区
//
var data = cd.end();
```


## CipherJs createDecipher(String algorithm, Bytes pass, Bytes iv)

该方法专门用来处理 `AES/CBC/NoPadding`, `AES/CBC/PKCS5Padding` 算法, 
其中 pass 参数必须是 16/32 字节固定长度,
如果密码是字符串, 应该使用 generateAesPass() 转换为 Bytes;
iv 是 16 字节固定长度;

```js
// ps 和 iv 参数必须和加密时提供的参数一致.
var cd = crypto.createDecipher("AES/CBC/PKCS5Padding", ps, iv);
var xbuf = [];
xbuf.push(cd.update(cdata));
xbuf.push(cd.end());
// ddata 是解密后的字节缓冲区
var ddata = sys.joinBytes(xbuf);
```


## Hash createHash(String algorithm)

创建 Hash 用于校验, 见 [Hash 类说明](docs/api-digest.md), 
algorithm 可以使用: `SHA-1`, `SHA-224`, `SHA-256`, `SHA-384`, `SHA-512`, `md5`, `md2`, `sm3`.

```js
var hash = crypto.createHash('sha-256');
hash.update('123');
hash.update('abc');
//
// result 是校验和数据字节缓冲区
//
var result = hash.digest();
```


## Bytes randomBytes(int length)

生成指定长度的随机字节序列.


## Bytes generateAesIV()

生成用于 AES 加密的 IV 参数; IV 可用用明文和加密数据一起保存传输.


## Bytes generateAesPass(string password)

使用字符串密码生成 AES 密钥参数, (SHA256 计算摘要作为返回值).


## string[] algorithmNames()

返回可用的加密算法名称数组.

## Object ECKeyPair()

随机生成公钥/私钥对

返回对象属性:

* publicKey  -- 公钥字符串 Base58 编码
* privateKey -- 私钥字符串 Base58 编码


# Class CipherJs

加密/解密对象, [Bytes 类说明](docs/api-bytes.md)

## Bytes update(String)

将字符串的底层字节数组做加密, 并返回加密数据的一个窗口数据, 
如果数据不足以填满窗口则返回空长度缓冲区.

## Bytes update(Bytes)

加密缓冲区数据. 并返回加密数据的一个窗口数据.

## Bytes update(Buffer)

加密缓冲区数据. 并返回加密数据的一个窗口数据.

## Bytes end()

终结加密过程, 并返回最终窗口数据.