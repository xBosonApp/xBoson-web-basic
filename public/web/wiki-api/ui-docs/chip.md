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


## `<chip:wiki>`

生成打开 wiki 文档的链接按钮, 标签体是显示的文字

必填参数:

* file : wiki 文件路径以 `/WEB/wiki-api/` 为根路径开始.

可选参数:

* id
* class

```html
<chip:wiki file='docs/witness.md'>共识表达式</chip:wiki>
```


## `<chip:dialog>`

无