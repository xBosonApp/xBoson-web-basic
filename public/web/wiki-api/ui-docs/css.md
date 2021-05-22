# 样式表标签

常用样式表


## `<css:cdn>`

加载存在于 CDN 中的程序库.

必填参数:

* src - 通常格式 `库名/版本/文件...`
 
```html
<css:cdn src="highlight/10.4.0/styles/androidstudio.css"/>
```

## `<css:scroll>`

全局设置滚动条样式, 该样式尽可能缩小滚动条的视觉影响.

无参数


## `<css:loading>`

显示一个 '正在读取' 的动画, 应该在所有脚本/资源之前调用标签,  
并且在页面加载后删除 id='xboson-preloading' 的标签, 以停止动画.