# 模态对话框组件


## `<moda:button>`

在模态对话框中显示一个 submit 按钮.

参数: 

* text : 按钮显示名称
* id

```html
<moda:button text='创世区块私钥离线' id='offline_gpk_button'>
  <form:post app='81092b8cd82041a2b81296409eba92da' mod='basic' api='offline_gpk'>
    <mp:close when='this.code == 0'>
      <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
    </mp:close>
  </form:post>
</moda:button>
```


## `<moda:cacel>`

在模态对话框中显示一个取消按钮, 点击后对话框关闭.

```html
<footer>
  <moda:cancel/>
</footer>
```


## `<moda:ok>`

在模态对话框中显示一个 submit 按钮, 文本显示 `确定`.

```html
<moda:ok>
  <form:post app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='mapper_create' formid='create'>
    <mp:close when='this.code == 0'>
      <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
    </mp:close>
  </form:post>
</moda:ok>
```


## `<moda:open>`

通常放在按钮标题体中, 当按钮被按下, 打开指定的页面作为对话框内容.

必填参数:

* url: 加载到模态的页面路径

```html
<form:button label='打开Tab页面模态' icon='magic'>
  <moda:open url='at-tpl-demo/moda-tabs.htm'/>
</form:button>
```


## `<moda:tab>`

Tab 内容页, 与 moda:tabpanel 联合使用.

必填参数:

* title 标题

可选参数:

* id, 
* class

```html
<moda:tab title='创建接口' id='tab_create'>
```


## `<moda:tabpanel>`

Tab 标签页容器, 将多个 moda:tab 标签放入容器中.

可选参数:

* id, 
* class

```html
<moda:tabpanel>
  <moda:tab title='创建接口' id='tab_create'>
  </moda:tab>
  <moda:tab title='Webservice 发现'>
  </moda:tab>
  ...
</moda:tabpanel>
```


## `<moda:frame>`

模态对话框框架, open 打开的页面, 必须使用该元素作为页面根元素.

必填参数:

* title 标题

可选参数:

* id, 
* class, 
* width - css 样式的宽度

```html
<moda:frame title='创建/发现 Webservice 接口'>
  ...
<moda:frame>
```