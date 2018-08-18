# 行为组件


## 全局事件定义

事件都有一个参数, 一些事件的参数可以为空.

### `SELECT_TABLE_ROW`

表格行选择事件, 参数是当前行选择行的数据集, 
参数为 null 时说明没有选择任何行

### `TABLE_UPDATE_REQ` 

请求表格重新从数据源获取内容并更新画面.

### `TABLE_DATA_READY` 

表格数据已经构建完成.

### `FORM_API_RESULT`  

当 api 接口返回后的事件, 参数是接口的返回数据集.

### `PAGE_UPDATED`  

画面重新绘制后发出这个时间, 不需要事件 id

### `CLOSE`      

关闭组件的请求

### `CLOSED`       

组件已经关闭发出这个消息

### `CLICK`  

组件被用户按下

## `PAGE_DESTROY`

页面销毁时被调用



## `<mp:close>`

接收来自父容器的消息(消息定义在父容器), 并转发送 close 事件一直到上层根节点和子节点.

必填参数:

* id: 向目标对象发送关闭事件

可选参数:

* when: js 表达式, 用于处理消息数据, this 是消息数据根节点, 数据结构与消息有关.

```html
<form:post app='a1e22425b8574d67bf4f200b4ccde506' mod='webservice' api='create'>
  <mp:close when='this.code == 0'>
    <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
  </mp:close>
</form:post>
```


## `<mp:delete>`

将该组件置于按钮组件内部, 当按钮按下, 执行删除操作. 删除成功后发出 DELETE 事件.

必填参数:

* primary: 指出数据集主键, 也使用该名称作为上传参数. 
* dataid: 数据在数据池中的 id.         
* app: 应用 id
* mod: 模块 id
* api: 指定 api 接口参数.

```html
<mp:delete app='a1e22425b8574d67bf4f200b4ccde506' primary='wsid'
    mod='webservice' api='remove' dataid='datatable0'>
</mp:delete>
```

## `<mp:onclick>`

在按钮(等组件)和 handle 组件之间做桥接, 组件的 dom click 事件转换为总线 CLICK 消息.
可以放在超链接, 表单(按钮), 或直接接受父组件的消息.
如果配置 recvtype / recvid, 则接受消息并将消息结果保存在临时变量, 作为 click 事件的消息数据.

可选参数: 

* recvtype: 消息类型. 
* recvid: 消息 id.
 
演示在 mp:handle 中.


## `<mp:handle>`

通用事件处理器, 必须放在发出消息的节点中作为子节点, 处理父节点发来的消息, 
父节点必须有属性: `data-event-type`, `id`; 自定义脚本从 4 个地方来:

1. 用 handle 的 src 属性从 url 加载一个脚本.
2. 用 script 子标签的 src 属性加载一个脚本.
3. 从 script 子标签中获取代码 (不推荐).
4. 从 handle 的标签体中获取代码 (不推荐).

函数模板: (function(data, type, id, handle) { })

* data   : 接收发来的数据.
* type   : 消息类型
* id     : 消息 id
* handle : 标签本身的 jquery 对象
  
可选参数:

* src: 加载脚本的 url

```html
<form:button label='提取字段' icon='spinner'>
  <mp:onclick recvtype='SELECT_TABLE_ROW' recvid='event0'>
    <mp:handle>
      (function(data, type, id, handle) {
        dbmap.parseSql(handle.parents("form").first());
      })
    </mp:handle>
  </mp:onclick>
</form:button>
```


## `<mp:page_update>`

通常放在表单控件中作为子标签, 当控件被触发, 则发出 PAGE_UPDATE 消息.
一些控件依赖这个消息工作, 当发现控件在页面修改后不在工作, 可能需要触发这个消息.
  
```html
<form:button label='解析 Wsdl' width>
  <form:post app='a1e22425b8574d67bf4f200b4ccde506' mod='webservice' api='parsewsdl'>
    <mp:handle src='/datas/webservice/wsdl.js'/>
    <mp:page_update/>
  </form:post>
</form:button>
```


## `<mp:loaddata>`

立即从数据池中取出数据, 推入父级控件, 支持: form; 通常用于主页面向对话框传参.

必填参数:

* id: 数据 id.

```html
<mp:loaddata id='data0'/>
```


## `<mp:savedata>`

接受指定的事件, 并将事件发送的数据保存到数据池, 稍后可以从池中取出, 可放在任意位置.

必填参数:

* type: 事件类型. 
* id: 数据 id.

```html
<mp:savedata type='SELECT_TABLE_ROW' id='data0'/>
```


## `<mp:send>`

接受父级组件固定事件, 转换为动态事件

必填参数:

* type: 发出的事件类型, 
* id: 发出的事件 id.

```html
<mp:send type='TABLE_UPDATE_REQ' id='event0'/>
```


## `<mp:usability>`

将该组件置于被控组件内部, 控制该组件的可用性, 一般用于表单元素.
  
必填参数:

* recvid: 指定发出控制消息的组件 id (谁来控制该组件改变可用性).

```html
<form:button label='删除' icon='trash-o'>
  <mp:usability recvid='event0'/>
</form:button>
```