# 图像操作

绘图操作 / 对图像文件进行修改.


# 引入代码


```javascript
var image = require('image');
```


# DEMO

```javascript
var image = require("image");
var buf = Buffer.from([..........]);
var pic = image.read(buf);
pic.resize(x, y, w, h);
buf = pic.toBuffer("jpeg");
```


# 方法 

## image.read(Buffer: picture), image.read(Bytes: picture)

从 Buffer 缓冲区中读取图片, 并返回 Picture 对象.


# Class Picture

## int height()

返回图片的高度


## int width()

返回图片的宽度


## resize(int:x, int:y, int:width, int:height)

将图片剪裁为新的尺寸该方法会修改自身,  
以原图片 x,y 为起点, 取宽度和高度 width,height 为新图片.


## toBuffer(String:format);

按给出的格式转换为二进制缓冲区

参数: format 格式字符串, 如 'jpeg'.  
返回: Buffer 对象.