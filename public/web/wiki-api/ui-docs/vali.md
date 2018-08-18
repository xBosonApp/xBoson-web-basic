# 校验组件

通常放在表单元素中作为子标签.


## `<vali:email>`

作为要验证表单的子标签, 在 form 递交前验证邮件格式有效性.

必填参数:

* min: 最小长度, 0 则允许空
* max: 最大长度 

```html
<vali:email min='0' max='99'>
```


## `<vali:number>`

作为要验证表单的子标签, 在 form 递交前验证数字有效性.
  
必填参数:

* min: 最小值, 0 则允许空
* max: 最大值

```html
<vali:number min='0' max='99'>
```


## `<vali:string>`

作为要验证表单的子标签, 在 form 递交前验证字符串有效性.

必填参数:

* min: 最小长度, 0 则允许空
* max: 最大长度

```html
<vali:string min='0' max='99'>
```


## `<vali:url>`

作为要验证表单的子标签, 在 form 递交前验证 url 格式有效性.

必填参数:

* min: 最小长度, 0 则允许空
* max: 最大长度

```html
<vali:url min='0' max='99'>
```