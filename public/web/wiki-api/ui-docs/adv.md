# 高级开发指南

平台的 Masquerade 模板使用扩展名 `.htm`, 浏览器请求时, 服务器会对文件进行渲染并返回一个 html 静态页面.

这里包含 Masquerade 模板的所有细节.


# bird 表达式

`###A.b###`

* 表达式以 ### 作为开始, 以 ### 作为结束
* 表达式中只支持从 '.' 运算符, 变量之间允许有空格
* 表达式只在普通文本中生效, 特殊标签的属性, 有不同的行为, 具体查看特殊标签的定义
* 上下文即 context 对象, 这个对象不需要在表达式中写出, 上下文参考 [上下文中的对象] 一节.
* 在一些特殊标签中, `###` 这个符号是不需要写出的, 具体查看特殊标签的定义


# 用户自定义 HTML 标签库

允许利用 HTML 语法定义程序库, 使定义和使用更符合前端开发者的习惯; 这些标签库都是由服务端渲染的.

自定义标签在 /private/tag 目录, 文件名(不含扩展名, 比如 user.htm 即 user 标签) 即为标签的名称; 这些标签直接在模板中使用, 引用的方式: `<user v='100'/>`; 引用标签的的时候, 参数都会作为上下文变量传递给此标签定义部分; 上例中, 在 user.htm 文件里可以使用变量 `v`.

当调用自定义 HTML 标签且含有标签体时, 标签体中的内容并不会自动渲染, 必须使用 `<pit/>` 这个标签来渲染调用时的标签体, 标签体中也是模板语法.

如果有子目录则使用 html 名字空间来 `:` 引用子目录中的标签, 子目录的子目录使用 '-' 分割, 所以目录名称不要有 `:` 和 `-` 符号.

引用自定义标签的例子, `在文件中定义的位置 ==> 模板中引用的语法`

* 例: `[/private/tag]/tag1.html            ==>  <tag1 />`
* 例: `[/private/tag]/dir1/tag2.html       ==>  <dir1:tag2 />`
* 例: `[/private/tag]/dir1/dir2/tag3.html  ==>  <dir1-dir2:tag3 />`


# Html 模板系统标签

* 系统标签是系统定义的, 或通过安装插件得到的功能.
* 没有标签体的标签, 即使声明了标签体也不会被渲染.
* 标签属性中不能有表达式, 表达式的使用要遵从标签的说明.
* 属性的解析方法, 不同的标签定义不同, 下文中的*变量*意思是从上下文对象中取一个属性作为当前值
* 可选的属性使用 `[]` 符号标注, 实际使用时不要有 `[]` 符号
* 每个系统标签的属性功能不同, 特别注意一些标签的属性默认支持表达式.

## slice 切片

`<slice ref='name' attr1='' attr2='' noerror='1' [exp='true'] />`  
`<slice define='name' noerror='1' [exp='true']>BODY</slice>`

*   创建一个切片, 如果有 ref 属性, 则不能有标签体, 用于引用一个切片到当前位置
    并且 扩展属性都会传入上下文供给 <slice define/> 的 body 中使用
    如果有 define 属性, 则必须有标签体, 切片只有在被引用的时候才会渲染
    如果定义 noerror 则不会因为错误抛出异常 (如无效的引用), 否则不要定义!

## include 包含

`<include src="/page/a.html" [private="false"] [exp='false']/>`

*   包含一个静态文件, 如果以 '/' 开始文件层级默认相对于 public 目录,
    如果以 './' 或非 '/' 开始则相对于当前文件目录.
    如果 private="true" 则相对于 /private/include 目录, 忽略相对路径,

## for 循环

`<for from="array" save='b'  index='i'> ###b### ###i###</for> `  
`<for from="object" save='c' index='i'> ###c### ###i###</for> `

*   循环渲染 标签体
    每次循环的变量都保存在 save 指定的变量中, 之后可以通过表达式取出
    每次循环的索引保存在 index 指定的变量中

## if 判断

`<if var="c" [not='true']></if>`

*   如果条件为 true(默认) 则渲染标签体,
    如果 not='true' 则条件取反, var 支持复杂表达式.

## else

`<else></else>`

*   如果 else 之配对的 if 被渲染则 else 不会渲染, 反之则渲染;
    else 必须与 if 配对且唯一配对, 未配对的 else 永远不被渲染;

## api 发出 HTTP 请求

`<api url='http://url/?parm' to='api1ret' [type='json/txt'] [method='get/post'] [exp='boolean'] [timeout='5']/>`

*   请求一个 API, method 指定方法 (默认get),
    使用 type 指定的类型解析数据 (默认为 json), 并把结果保存在 to 指定的变量中;
    exp=true 则 url 中允许表达式, 如果请求出错在 to 变量上绑定一个 Error 对象;
    timeout 超时后发出异常, 单位 秒.

## create 创建对象

`<create to='objname' varname1-s='string' varname2-e='express' varname3-n='9' />`

*   创建一个对象 Object, 放入上下文的 to 指定的变量中
    参数的说明: 由 nnn-T 形成的参数列表 nnn 指定一个属性, T 指定数据类型
    T 的有效类型: 's': 字符串, 'e':表达式, 'i':整数, 'f':浮点数
    如果不指定类型, 默认是字符串, 如果 to 指定的变量以及存在则什么都不做

## set 设置变量, 或设置对象属性

`<set to='varname' [attr='attrname'] value='abc' [exp='false']/>`

*   设置 to 指定的属性的 attr 值为 value,
    如果 attr 未设置, 则直接修改 to 指定的变量的值
    如果 exp==true (默认false), 则从上下文中取数据
    修改系统变量会抛出异常

## del 删除变量/对象

`<del to='varname'/>`

*   删除上下文中的变量, 不会抛出异常, 但无法删除一些系统变量

## script 脚本

`<script [src='/script1.js'] [runat='server/client']/>`

*   如果 runat==server (默认是client)
    设置了 src 属性则运行一个服务端脚本文件, 相对于 /private/script 目录,
    否则不设置 src 可以直接写服务端脚本.
    脚本运行在沙箱中, 能力受限;

  * 脚本中可用的变量:
    - `query`   : Object, 请求页面时设置的 GET 参数.
    - `module`  : Object, 与 nodejs 中的 module 定义相同, 用于分辨引用时模块.
    - `module.exports` : 像 nodejs 一样导出一个模块. 另一个模块可以用 require() 来引入.

  * 可用函数:
    - `val(name [, value])`, name 是变量名, 设置 value 则 set 变量, 否则 get 变量.
    - `end()`, 脚本运行完成, 脚本中必须调用这个方法, 否则请求不返回.
    - `write(Object)`, 写出字符串到页面, 必须在页面渲染完成前调用, (不能在 setTimeout 中调用).
    - `require(name, cb)`, 引用一个模块, 被引用模块在 /private/script 目录中存放.
    - `console.log()`, 在控制台打印消息.

## pit 渲染标签体

`<pit/>`

*   在用户自定义标签库中, 渲染调用这个标签库时的标签体

## never 不会被渲染

`<never></never>`

*   不会进行任何处理的标签, 用于写注释

## stop 停止渲染

`<stop/>`

*   无条件停止渲染.


# 上下文中的对象

这些对象可以通过 bird 表达式引用, 比如要引用 `context.query.id` 则使用表达式 `###qeury.id###`;  
如果要获取请求头中的信息使用 `###getHeader('Context-Type')###`.

```js
context: { // [r155]
//[-- 在 http 中间件中有效的属性: --]
    nextId : Function()               -- 生成一个不重复的 ID
    session: Function()               -- 返回与客户端绑定的数据 (!待实现)
    query  : Object                   -- Http 请求参数
    builder: html_builder             -- 生成 html 代码的对象见 base.js
    expression: expression_complier   -- 编译并解析表达式的方法 (过时, 使用 parse)
    parse  : Function(String)         -- 编译一个字符串(其中可以有表达式), 返回的对象有 val(context) 可以取得结果
    baseurl: String                   -- 中间件解析器根路径
    filepool: Object                  -- 系统文件池
    setHeader: function(name, value)  -- 设置 HTTP 应答头域的值
    getHeader: function(name)         -- 取得 HTTP 请求头域的值
    getVmContext: function()
    log : function(...)               -- 写日志
    config : {}                       -- 读取运行时配置, runtime_
//[-- 只在当前标签范围中有效的属性: [r175]--]
    tag_scope: {
        controler: {
            disable_sub()             -- 不渲染签体中的元素
            enable_sub()              -- (默认) 渲染标签体中的元素
        }        
        body: [ Buffer1, Buffer2 ... BufferN ]
                                      -- 标签体中静态文字的缓冲对象, 允许修改
                                      -- buffer 中的数据, 但修改 body 本身无效
        attr: Object                  -- 标签中的属性
        attr_str: String              -- 标签属性原始字符串
        name: String                  -- 标签名
        selfend: bool                 -- 自结束标签为 true
    }
}
```