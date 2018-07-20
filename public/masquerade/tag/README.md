# 模板控件库


# 设计原则

* 尽可能将运算放在客户端
* 脚本可能重加载, 但要保证行为正常.
* 每个组件只完成一个任务, 组件接受一个事件, 发出一个事件.
* 尽可能使用嵌套多个组件来完成复制任务, 而非在一个组件中做所有的事.

## 数据绑定

数据池中保存当前页所有数据, 使用 id 来确定数据名称, 数据可以是任何类型.

数据池中的数据, 通过 `xb.save_data(), xb.load_data()` 存取, 
`mp:savedata mp:loadata` 标签读写跨窗口数据.

## 消息模型

所有标签都连接在UI消息总线上, 消息使用消息类型和标签 ID 来确定, 消息数据可以是任何类型.
实时数据也通过消息传递, 可以将消息数据存储在数据池中供以后使用.

消息约定定义: 标签含有特殊字段 `data-id` 表示消息 id, `data-event-type` 表示消息类型;
消息约定表示控件会发出该消息, 子控件会检查父控件的消息约定.


# 废弃说明

由于这些文件完成的功能不完整, 并且不符合模板的设计原则而废弃;

废弃的文件不会删除, 也不会维护.

使用方法见开发文档.


## 废弃列表

* ck.htm
* uiauth.htm
* webinfo.htm

### web 目录

* 全部 !

### ui 目录

* button.htm
* datatable.htm
* input.htm
* row.htm