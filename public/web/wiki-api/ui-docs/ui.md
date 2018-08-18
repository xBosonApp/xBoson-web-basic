# 杂项组件


## `<ui:form>`

表单, 可以放入任何标签中.

可选参数:

* id, 
* class, 
* method, 
* action

```html
<ui:form id='listform'>
    <form:text name='filename' label='文件名'/>
    ...
</ui:form>    
```


## `<ui:grid>`

页面构图根元素, 一个页面可以有多个.

可选参数:

* id, 
* class, 
* title, 
* icon: fa 系列图标名, 无需 'fa-'前缀,

```html
<ui:grid id='idid' class='list' title='流程图文件列表'>
  <ui:form id='listform'>
    <form:text name='filename' label='文件名'/>
  </ui:form>
</ui:grid>
```

## `<ui:gotop>`

生成一个返回到页头的按钮, 无参数.

```html
<ui:gotop/>
```


## `<ui:jarviswidget>`

[不推荐使用], jarviswidget 组件封装.

可选参数:

* id    = 框架id
* title = 框架的标题头
* class = 框架 class

```html
<ui:jarviswidget id='doc_index' title='开发手册'>
  ...
</ui:jarviswidget>
```


## `<ui:modaldialog>`

废弃, 使用 moda 中的组件替代.


## `<ui:button>`

废弃不用


## `<ui:datatable>`

废弃不用


## `<ui:input>`

废弃不用


## `<ui:row>`

废弃不用