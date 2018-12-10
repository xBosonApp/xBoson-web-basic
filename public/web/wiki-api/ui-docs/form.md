# form 表单元素

没有特别说明的 width 属性, 有效值为 1-10, 默认值为 3.  
icon 是 [font awesome](http://www.fontawesome.com.cn/faicons/) 字体, 没有 `fa` 前缀, 用于控件图标.  
form 标签本身在 [ui:form](ui-docs/ui.md) 中定义.


## `<form:br>`

用于分行, 无参数.


## `<form:btn_toolbar>`

按钮栏, 用于按钮组布局.

可选参数:

* width: 宽度 1-10
* label: 标题

```html
<form:btn_toolbar>
  <form:group>
    <form:submit label='查询'/>
    <form:reset/>
  </form:group>
  <form:group>...</form:group>
  <form:group>...</form:group>
</form:btn_toolbar>
```


## `<form:group>`

按钮组

可选参数:

* width: 宽度
* label: 标题


## `<form:button>`

无行为按钮, 不绑定任何事件.

必填参数:

* label: 按钮显示名称,
  
可选参数:

* name, 
* id, 
* class,  
* icon: 按钮图标 fa 名称, 

```html
<form:button label='开始游戏'/>
```

## `<form:checkbox>`

一个单选框, 当设置 `toggle_display` 参数时, 页面变化后新加入的标签不在控制范围,
此时需要发送一个 PAGE_UPDATE 全局消息.

必填参数:

* label: 显示名称, 
* title: 另一个显示名称

可选参数:

* id, 
* class, 
* width: 宽度 1-10, 
* name: 表单名称, 
* toggle_display: 该 css 选择器指向被控制的组件, 被选中时该组件显示, 否则隐藏,
* reverse: toggle_display 设置时有效, 使被选元素在单选框选中时隐藏, 否则显示.

```html
<form:checkbox id='hidenonsoap' label='显示非 SOAP 接口' width='3'
      toggle_display='.wsdl_function:not(.soap)' />
```


## `<form:date>`

弹出年-月-日选择对话框, 递交格式为 'YYYY-MM-dd'

必填参数:

* label: 显示名称, 
* name : 表单名称
    
可选参数:

* class, 
* id, 
* value: 默认值, 未设置默认值为今天.
* width: 宽度 1-10, 
* offset: 整数天的偏移值(有默认值无效)

```html
<form:date name='begindate' label='开始日期' width='4' value=''/>
<form:date name='enddate' label='结束日期' width='4' offset='1'/>
```


## `<form:time>`

弹出时间选择对话框.

必填参数:

* label: 显示名称, 
* name : 表单名称
    
可选参数:

* class, 
* id, 
* value: 默认值, 
* offset: 整数秒的偏移值(有默认值无效)

```html
<form:time name='time_begin' label='开始时间'/>
<form:time name='time_to' label='结束时间' value='23:59:59'/>
```


## `<form:title>`

表单标题, 无参数, 标题文本放在标签体中

```html
<form:title>字段映射配置</form:title>
```


## `<form:dict>`

生成下拉列表, 列表选项来自字典

必填参数:

* typecd: 字典主键, 
* label: 显示名称, 
* name: 表单参数名称

可选参数:

* val: 默认值, 
* id, 
* class,  
* width: 宽度

```html
<form:dict name='targetorgan' label='提供方机构编码' tooltip='可空'
    typecd='NS-APP-01-ORGAN' width='6'>
  <vali:string min='0' max='50'/>
</form:dict>
```


## `<form:password>`

密码输入表单.

必填参数:

* name: 表单名称, 
* label: 显示名称,
    
可选参数:

* id, 
* class, 
* icon: 图标名, 不需要 fa 前缀, 
* tooltip: 弹出提示, 
* value: 默认值, 
* width: 宽度

```html
<form:password name='userpwd' label='密码' tooltip='如果不需要请填 0' width='10'>
  <vali:string min='0' max='50'/>
</form:password>
```


## `<form:readonly>`

作为可输入表单控件子元素, 使表单只读, 无参数

```html
<form:text name='_id' label='文件名' tooltip='不可改' width='10'>
  <form:readonly/>
</form:text>
```


## `<form:reset>`

重置表单中所有控件的值

可选参数:

* label: 显示名称, 默认为 `重置`
* class, 
* id, 
* name : 表单名称


## `<form:row>`

布局控件, 无参数


## `<form:select>`

固定内容的下拉选项

可选参数:

* id, 
* class 
* label : 显示名称, 
* width: 宽度
* name

```html
<form:select name='ispublic' label='访问权限' width='10'>
  <option value='0'>私有</option>
  <option value='1'>公共</option>
</form:select>
```


## `<form:api_select2>`

从 api 接口返回的数据生成下拉选项, 在初始化时, 控件会使用主键进行一次查询以将主键转换为名字,
接口必须支持主键查询.
  
必填参数:

* api : api ID
* mod : 模块 ID 
* app : 应用 ID. 
* id_field     : 从数据集中获取(表单)值的字段, 默认 'id'. 
* text_field   : 从数据集中获取文本的字段, 默认 'text'.
* result_field : 从数据集中获取数组的字段, 默认 'data/result'.
 
可选参数:

* id : 通用属性
* class : 通用属性, 
* label : 显示名称, 
* width : 宽度, 1-10
* name : 表单名称
* tooltip : 提示

```html
<form:api_select2 name='criid' label='交换标准' tooltip='交换标准代码' width='6'
    app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='cri_list'
    text_field='standardname' id_field='criid'>
  <vali:string min='1' max='32'/>
</form:api_select2>
```


## `<form:select_dict>`

生成一个选择字典的对话框.

可选参数:

* name
* label 显示标题
* tooltip
* width


```html
<form:select_dict name='typecd' label='类别编码' tooltip='选择一个字典以写入' width='3'>
  <vali:string min='1' max='45'/>
</form:select_dict>
```


## `<form:status>`

状态选项, 无参数.


## `<form:text>`

输入文本.

必填参数:
  
* name: 表单名称, 
* label: 显示名称,
    
可选参数:

* id, 
* class, 
* icon: 图标名, 不需要 fa 前缀, 
* tooltip: 弹出提示, 
* value: 默认值, 
* width: 宽度
 
```html
<form:text name='standardname' label='交换标准编码名称' tooltip='最少1字符' width='6'>
  <vali:string min='1' max='45'/>
</form:text>
```


## `<form:textarea>`

输入文本域

必填参数:
  
* name: 表单名称, 
* label: 显示名称,
    
可选参数:

* id, 
* class, 
* icon: 图标名, 不需要 fa 前缀, 
* tooltip: 弹出提示, 
* value: 默认值, 
* width: 宽度
* rows: 行高
 
```html
<form:textarea name='map_json' label='字段配置映射' tooltip='隐藏域' 
      width='10' rows='6' value='{}'>
</form:textarea>
```


## `<form:submit>`

递交按钮.

必填参数:

label: 按钮显示名称,
    
可选参数:

* id, 
* class, 
* icon: 按钮图标 fa 名称, 
* name : 表单名称
    
```html
<form:btn_toolbar>
  <form:group>
    <form:submit label='查询'/>
    <form:reset/>
  </form:group>
</form:btn_toolbar>
```

## `<form:get>`

无显示, 用 get 方法请求 api, 作为按钮子节点; 返回数据除了弹出提示, 并将数据发送到消息总线.
  
必填参数:

* api, 
* app, 
* mod, 

可选参数:

* id: 消息id, 
* formid: 从指定的表单接收参数作为请求参数.

```html
<!-- 当 ok 按钮被点击后, 调用接口, 当接口返回成功, 则关闭对话框并发送 TABLE_UPDATE_REQ 消息 -->
<moda:ok>
  <form:get app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='mapper_create' formid='create'>
    <mp:close when='this.code == 0'>
      <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
    </mp:close>
  </form:get>
</moda:ok>
```


## `<form:post>`

无显示, 用 post 方法请求 api, 作为按钮子节点; 返回数据除了弹出提示, 并将数据发送到消息总线.
用法同 `<form:get>`

必须参数:

* api, 
* app, 
* mod, 

可选参数:

* id: 消息id, 
* formid: 从指定的表单接收参数作为请求参数.