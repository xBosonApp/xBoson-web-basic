# chip

一个标签即可完成一项完整的功能


## `<chip:flow_diagram>`

在当前位置绘制流程图, 该页面可以直接请求, 参数通过 url 传入, 
访问方法 `http://localhost:8080/xboson/face/masquerade/tag/chip/flow_diagram.htm?fileid=admin-pl/filename`
  
参数:

*  [必须] fileid - 文件 id (完整文件名)

```html
<chip:flow_diagram fileid="admin-pl/filename"/>
```


## `<chip:dialog>`