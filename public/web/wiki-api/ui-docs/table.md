# 表格组件


## `<table:api>`

从 api 接口返回的数据生成表格, 并关联查询表单, 自动分页.
字段映射用 <table:mapper/> 标签实现.

必填参数:

* api :  api ID
* mod : 模块 ID
* app : 应用 ID 
* form: form 表单的选择器, 作为表格的查询条件 (!注意: 选择器是 jquery 格式的).
         
可选参数:

* id: 表格 id, 
* class : 表格的 class,         
* dataName: 在 ajax 返回结果集中的数据属性名称, 默认 'result' 或 'data'.         
* hidepage: 为 1 时将不显示分页组件

```html
<table:api app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='remote_list' 
      form='#listform' id='datatable0'>
  <table:mapper label='配置名称' key='rname'/>
  <table:mapper label='用户名' key='username'/>
  <table:mapper label='安全配置类型' key='authoritytype'>
    <table:render_dict typecd='NS-APP-01-AUTHORITYTYPE'/>
  </table:mapper>
  <table:mapper label='状态' key='status'><table:render_status/></table:mapper>
  <table:mapper label='更新时间' key='updatedt'/>
  <table:mapper label='创建时间' key='createdt'/>
</table:api>
```


## `<table:mapper>`

ajax 数据表格字段映射, 一个标签代表一个映射, 会生成 label 定义的表格头, 
默认按定义顺序生成.

必填参数:

* key   : 数据主键
* label : 表格头名称

demo 见 table:api


## `<table:render>`

自定义渲染函数, 标签体为 js 脚本 (不要使用 script 标签包围).  
字段渲染器, 放在 table:mapper 标签中.

```html
<table:render>
function(data, type, row, meta) {
  return {1:"创世块", 2:'数据块', 3:'加密数据块', 4:'链码块', 5:'消息块'}[data];
}
</table:render>
```


## `<table:render_dict>`

字典翻转.  
字段渲染器, 放在 table:mapper 标签中.

必填参数:

* typecd 字典主键

```html
<table:render_dict typecd='NS-APP-01-AUTHORITYTYPE'/>
```
    
    
## `<table:render_enum>`

枚举渲染器, 将数据反转为值.  
字段渲染器, 放在 table:mapper 标签中.

必填参数:

* map - 枚举 json 字符串
  
```html
<table:render_enum map='{ 1: "公共", 0: "私有" }'/>
```
  
  
## `<table:render_ms>`

渲染消耗时间字段, 将毫秒值转换为合适单位的数值, 无参数.
字段渲染器, 放在 table:mapper 标签中.

```html
<table:render_ms/>
```


## `<table:render_status>`

渲染 status(状态) 字段, 无参数.
字段渲染器, 放在 table:mapper 标签中.

```html
<table:render_status/>
```


## `<table:render_time>`

将毫秒值转换为年月日
字段渲染器, 放在 table:mapper 标签中.

```html
<table:render_time/>
```