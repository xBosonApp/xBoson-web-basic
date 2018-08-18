# 布局组件


## `<layout:frsection>`

在 form 标签中生成一个非表单元素.  
因为在 form 中的表单元素有一个固定的结构, 该元素封装了这个结构.

可选参数:

* width: 宽度 1-10
* label: 标题
* class: html 属性


```html
<layout:frsection label='值域映射' class='input' width='2'>
  <input type='hidden' name='typecd'/>
  <input type='text' name='typenm' readonly tooltip='值域映射开启后有效'/>
</layout:frsection>
```


## `<layout:label>`

使用 form 表单格式显示一段固定文本.

可选参数:

* width: 宽度 1-10
* label: 标题
* class: html 属性

```html
<layout:label label='说明' width='3' icon='file-text-o' class='notetext'/>
```


## `<layout:panel>`

显示一个面板, 无参数

```html
<fieldset>
  <layout:panel>
    <div>状态: <b id='ps_msg'></b></div>
    <div>总数据: <b id='ps_total'></b></div>
    <div>成功: <b id='ps_success'></b></div>
    <div>失败: <b id='ps_fail'></b></div>
  </layout:panel>
</fieldset>
```


## `<layout:progress>`

显示一个进度条, 

可选参数

* id

```html
<layout:progress id='total_progress'/>
<script>
var progress = $('#total_progress');
// 动态设置完成度
progress.css('width', '45%');
</script>
```

## `<layout:table>`

生成一个空表格, 无参数, 可以将普通表格标签放在表格体中.

```html
<layout:table/>
<layout:table>
  <thead></thead>
  <tbody></tbody>
</layout:table>
```