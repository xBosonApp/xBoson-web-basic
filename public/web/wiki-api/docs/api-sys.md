# SYS 模块

全局模块, 在脚本中立即可用.

所有服务 API 都将使用这个模块与客户端浏览器来交互数据.


# 可用属性

## sys.request

获取 HTTP 请求参数.

```javascript
// 获取 http 请求参数 name 的值
var name = sys.request.name;
```

## sys.requestParameterMap

获取 HTTP 请求参数的数组, 由 HTTP 多个同名参数组成的数组.

```javascript
// 总是返回数组
var values = sys.requestParameterMap.checkbox_values; 
```


## sys.requestJson

客户端使用 POST 请求递交 `Content-Type: application/json` 类型的数据时, 调用 parseBody() 后,
POST Body 中的数据将被解析成 js 对象并绑定在 requestJson 属性上.


## sys.result

应答数据集; 可以通过 addRetData() 方法绑定数据, 或通过 setRetData() 将数据应答给客户端.



# 扩展 API 

这些方法仅在 2.0 平台中可用.

## sys.request.getString(string:name [, int:min, int:max])

返回 string 类型的 http 请求参数, 带有值检测, 当值不符合检查条件会抛出异常.

参数:

  * name: 参数名
  * min: 最小长度, 当 min <= 0 则允许返回 null, 否则值长度必须 >= min; 默认值 1.
  * max: 最大长度, 值长度必须 <= max, 默认值 4096.


## sys.request.getInteger(string:name [, boolean:allowNull, int:min, int:max])

返回整数类型的 http 参数, 带有值检测, 当值不符合检查条件会抛出异常.

参数:

  * name: 参数名
  * allowNull: 当参数为空时, true 返回 0, 否则会抛出异常; 默认 false.
  * min: 值必须 >= min; 默认为 long 最小值.
  * max: 值必须 <= max; 默认为 long 最大值.


## sys.request.getFloat(string:name [, boolean:allowNull, double:min, double:max])

返回浮点(小数)类型的 http 参数, 带有值检测, 当值不符合检查条件会抛出异常.

参数: 

  * name 参数名
  * allowNull 允许空参数; 默认 false.
  * min 值必须 >= min; 默认为 double 最小值
  * max 值必须 <= max; 默认为 double 最大值


## sys.request.getSafePath(string:name [, boolean:allowNull])

路径字符串安全检查, 不安全的路径会抛出异常

参数: 

  * name 参数名
  * allowNull 允许空参数; 默认 false.

## sys.request.getHeader(string:name)

返回 http 请求头域.


## sys.request.body([int: limit])

以 Buffer 对象的形式返回 http body 的二进制数据.  
如果内容长度超过限制抛出异常; 如果没有 body 数据返回 null;

参数 :

  * limit body 字节长度限制.
  * 返回 Buffer 对象.

 
## sys.request.contentLength()

返回 POST 内容字节长度.


## sys.request.contentType()

返回 HTTP 头域 'Content-Type' 的值.


## sys.request.multipart(Function(MultipartItem): FileProcessing)

上传文件数据解析, 此时 `Content-type` 为 `multipart/form-data`.
每个文件(参数)调用一次 FileProcessing 处理函数.
出现错误会抛出异常, 如果没有异常, 返回处理的文件(参数)数量.

DEMO:

```js
sys.request.multipart(function(item) {
  // 表单参数名称
  item.header.name;
  // 文件名称, 如果是文件才有这个参数
  item.header.filename;
  // 文件 mime-type, 如果是文件才有这个参数
  item.header['Content-Type'];
  // 读取文件内容到 Buffer 并返回
  item.readBuffer();
});
```

### class MultipartItem

一个文件(参数)对象, 其中读取(read 开头)的方法只能调用一次, 超过一次调用会抛出异常.

#### Object header

文件头属性, 有 filename/name/Content-Type 等属性.

#### Buffer readBuffer()

读取文件内容到 [Buffer 对象](docs/api-buffer.md) 并返回.

#### Bytes readBytes()

读取文件内容到 [Bytes 对象](docs/api-bytes.md) 并返回.

#### String readString([String: charset])

读取文件内容到字符串并返回.

#### int readTo(JsOutputStream: out)

读取文件内容并写出到 [输出流 JsOutputStream 对象](docs/api-streamutil.md) 并返回读取的字节数.

out 在返回后一定不会关闭, 如果传输数据时发生异常, 该异常会被抛出.


# 可用 API

## sys.addRetData(object:Value [, string:KeyName])

绑定数据到应答数据集, 应答数据集是当前 Api 请求上下文的隐含数据集, 由系统维护, 仅在当前请求上下文中有效.

参数:

* Value: 数据
* KeyName: [可选] 绑定到数据集的变量名称, 若省略该参数变量名使用 'result'.

```javascript
var list1 = {1,2,3};
sys.addRetData(list1, "key:list1");
//
// 这样写同样有效, 相当于调用 sys.addRetData(list1, "list1"), 
// 注意如果两个参数都是字符串, 则第一个参数是 value, 第二个参数是 key
//
sys.addRetData("key:list1", list1);
```


## sys.setRetData(int:Code [, string:Message, string...:KeyNames])

设置应答数据, 并从应答数据集中选择数据返回, 若在脚本中从未调用该方法, Api 将应答给客户端代码 999.

参数:

* Code: 返回码
* Message: [可选] 返回消息, 未设置则在已定义的返回码映射中选择对应的消息字符串.
* KeyNames: [可选] 从应答数据集中选择返回值, 这些值将应答给客户端

```javascript
// 设置返回数据, 并从应答数据集中选择 "list1" 返回给客户端.
sys.setRetData(0, "OK", "list1");
```


## sys.setStream(JsInputStream reader, String filename)

应答二进制数据, 读取 reader 中的所有数据返回给客户端, 并设置一个文件名以提示客户端保存.

这将忽略 $format 参数提供的任何对应答数据类型的提示; 同时通过 addRetData/put 等方绑定
的数据无法正确返回给客户端; 该方法调用后不可能给客户端返回更多数据.


## sys.put(string: name, object: value)

不经过应答数据集, 直接将变量 value 输出到结果集的 name 属性上, 
同样 name 调用两次, 取最后的值, 应答数据集查找不到该变量.


## sys.setHeader(string: name, object: value)

设置 http 响应头域.


## sys.getUserPID([{string}Or{StringArray}: userId])

获取用户的PID, userId 是用户名, pid 是用户对应的唯一 UUID;  
无参调用返回当前用户 pid; 一个字符串参数调用返回指定用户 pid;   
一个字符串数组调用返回 map, 使用 userId 索引这个 map, 返回 userId 对应的 pid.

参数:

* 无参调用
* userId:  字符串, 或数组, 该参数决定返回数据类型.

```javascript
var currentPId = sys.getUserPID();
var pid        = sys.getUserPID('userid');
var pidMap     = sys.getUserPID(["userid1", "userid2", "userid3"]);
var pid1       = pidMap["userid1"];
```


## sys.getUserIdByPID([{string}Or{StringArray}: userPID])

通过用户的 PID 获取用户的 userId, userId 是用户名, pid 是用户对应的唯一 UUID;  
无参调用返回当前用户的 userId; 一个字符串参数调用返回指定用户 userId;
一个字符串数组调用返回 map, 使用 userPID 索引这个 map, 返回 userPID 对应的 userId.

参数:

* 无参调用
* userPID: 用户 PID 的数组, 或是一个用户的 pid 字符串.

```javascript
var currentUserID = sys.getUserIdByPID();
var userid        = sys.getUserIdByPID('pid');
var useridMap     = sys.getUserIdByPID(["pid1", "pid2", "pid3"]);
var userid1       = useridMap["pid1"];
```


## sys.getUserAdminFlag([string:userId, string:orgId])

当前登录用户在当前机构的管理员标记，
1：平台管理员 3：租户管理员 5：开发商管理员

参数:

* userId: 若省略该参数, 则返回当前用户的标记, 否则返回指定用户的标记.
* orgId: 用户所在的机构.



## sys.getUserIdByOpenId([string:openid])

返回 openid 对应的 userid, 2.0 平台中 openid 就是 userid, 该函数仅为兼容性而存在; 无参调用返回当前调用 api 用户的 userid.

参数:

* openid: 就是 userid.


## sys.getUserOrgList()

返回调用 api 用户的所属机构集合.

```javascript
var orgList = sys.getUserOrgList();
for (var i in orgList) {
  var row = orgList[i];
  var orgId = row.orgid;
  var orgName = row.orgnm;
  var orgType = row.org_type;  // "v":开发商, "t":租户
}
```


## sys.isAnonymousUser()

如果当前用户是匿名访问用户返回 true


## sys.getUserLoginExpiration()

返回用户登录会话最大时长, 单位: 秒.


## sys.uuid(), sys.getUUID()

生成一个没有 '-' 号的 32 长 UUID 字符串.


## sys.nextId()

返回长整型数字, 尽可能生成集群生命期中唯一数字.


## sys.randomNumber([int:DigitLength])

返回随机数字转换后的字符串. 生成的数小于 10^DigitLength.

参数:

* DigitLength: 可选的参数, 默认为 6, 10 的 DigitLength 次方, 2 时生成的数字小于 100, 3 小于 1000.


## sys.randomDouble(int:precision, int:scale)

返回随机数字转换后的字符串, 生成的数小于 (10^precision) / (10^scale).

参数:

* precision: 生成小于 10 的 precision 次方的数字.
* scale: 处以 10 的 scale 次方.


## sys.randomIntWithMaxValue(int:max)

返回随机数字转换后的字符串, 生成的数小于 max.


## sys.randomString(int:Length)

返回生成的随机字符串, 长度小于 Length, 字符串中包含所有可见范围内的 ASCII 字符.


## sys.pinyinFirstLetter(string:HZ), sys.getPinyinFirstLetter(string:HZ)

返回 HZ 字符串中, 中文字符的首字母.


## sys.fullPinyinLetter(string:HZ)

将字符串中的中文字符转换为拼音, 英文保持不变, 并加入适当的空格使拼音易读.


## sys.formattedNumber(number:Val, string:Pattern)

返回格式化数字的字符串

参数:

* Val: 数字
* Pattern: 格式字符串, 

```javascript
//
// 返回 '12.35'
//
var formattedNumber = sys.formattedNumber(12.3456, "#.##");
```

## sys.instanceFromJson(string:Json)

将字符串转换为 js 对象, 与 JSON.parse() 意义相同.


## sys.jsonFromInstance(object:Obj)

将对象序列化为字符串, 与 JSON.stringify() 意义相同.


## sys.instanceFromXml(string:XmlStr)

将字符串转换为 js 对象.


## sys.xmlFromInstance(object:Obj) 

将 js 对象序列化为 xml 字符串.


## sys.emptyToNull(string:s) 

传入参数转换为字符串并Trim后，如果是空字符串""或字符串的值是忽略大小写的"null"，返回 null，否则返回传入的原值.


## sys.isNumber(object:v)

传入的对象是数字或可以转换为数字返回 true, 否则返回 false.


## sys.parseInt()

用全局 parseInt() 替代.


## sys.executeJavaScript()

不支持, 使用 vm 模块可以实现该功能.


## sys.printValue(object:o)

直接将变量输出到结果集的 print 属性上, 多次输出, print 将成为数组.


## sys.bytes(string:s)

将字符串转换为字节数组, 并返回数组.


## sys.encodeBase64(string|array:val), sys.encodeBase64String(string:val)

将字符串或字节数组转换为 base64 编码的字符串


## sys.decodeBase64(string|array:val), sys.decodeBase64String(string:val)

将 base64 的字符串, 转换回原先的数据.


## sys.md5(string:v)

返回字符串 v 的 md5 值.


## sys.encrypt(string:content, string:password)

使用密钥加密字符串, 返回加密后的字符串.


## sys.decrypt(string:content, string:password)

使用密钥解密字符串, 返回解密后的字符串.


## sys.regexFind(string:regex, string:str), sys.regexMatches(...)

使用正则表达式查询 str, 找到匹配返回 true, 否则返回 false.

```javascript
//
// 返回 true
//
var ret = sys.regexFind("Java.*", "测试Java测试");
```


## sys.regexSplit(string:regex, string:str)

```javascript
//
// 返回 ['Java', 'Hello', 'World', 'Java', 'Hello', 'World', 'Sun']
//
var ret = sys.regexSplit("[, |]+", "Java Hello World  Java,Hello,,World|Sun");
```


## sys.regexReplaceFirst(string:regex, string:str, string:replacement)

按正则表达式将 str 中的第一个匹配字符串替换为 replacement.


## sys.regexReplaceAll(string:regex, string:str, string:replacement)

按正则表达式将 str 中的全部匹配字符串替换为 replacement.


## sys.lotteryRate(array:RateList[, array:IgnoreList])

俄罗斯轮盘赌:
  随机命中的比率列表中项的索引，从 0 开始，如果参数的比率列表中项的和小于100，则可能返回比率列表的 最大索引值 + 1, 忽略列表中索引指向的比率列表中的项不会被返回，忽略的项的比率将被分摊到非忽略项上项, 忽略列表通常用来在某项命中数已经达到限定值时防止再次返回该命中.

```javascript
//
// 返回 0 的概率为 20.5% 但因为有忽略列表上升为 30%
// 返回 1 的概率为 0%, 2 的概率为 60%
// 返回 4 的概率为 10%, 因为定义的概率为 90%, 自动生成一个附加项.
//
var ret = sys.lotteryRate([20.5, 10.0, 50.5, 10.0], [1, 3]); 
```


## sys.bizLog(...)

该方法未实现; 这个函数无法适应复杂的业务日志需要.


## sys.csvToList(string|array:parseContent, string:delimiter, string:quoteChar, string:escape, string:header, int:preview)

解析 csv 字符串或文件.

参数:

* parseContent: 当参数是字符串, 则直接解析字符串; 否则数组中定义文件的属性: [filePath, fileName, charsetName], 文件从临时文件系统中读取.
* delimiter: 列分隔符, 通常为 ','.
* quoteChar: CSV文件所用的引号符号, 通常为 '"'
* escape: CSV文件所用的转义符号, 通常为 '/'
* header: CSV的表头，类型为数组，设置为[],则从CSV里自动检测
* preview: 输出 preview 行, 设置为 0 则输出全部行

```javascript
//
// arr 将为 [{"a":"1","b":"2"},{"a":"11","b":"22"}]
//
var str = "a,b\n1,2\n11,12";
var arr = sys.csvToList(["tmpCSV/","test.csv","UTF-8"],",","\"","\\",[],10);
```


## sys.listToCsv(string:filePath, string:fileName, string:charset, array:data)

将 data 数据序列化为 csv 字符串, 并存入用户临时文件系统, 每个用户有独立文件系统.

参数:

* filePath: 文件路径
* fileName: 文件名
* charset: 文件编码
* data: 数组, 每个元素是一行, 每行是一个对象, 键组成表头.


## sys.setReportData(fileName, dataList, templatePath, savePath)

* fileName: 模板文件名
* dataList: 数据集
* templatePath: 模板路径
* savePath: 输出文件保存路径
* 返回: 文件名

从 templatePath+fileName 文件中读取 EXCEL 模板, 并以该模板创建报表;
dataList 可以是一个字符串, 描述从应答数据集中获取数据作为表格数据, 
或 dataList 可以是字符串数组, 每个字符串都从应答数据集中返回一个数据作为表格数据并将他们合并到表格中,
或 dataList 本身是报表数据直接压入表格中; 生成的数据保存在名称为 `data` 的表格中, 在必要时会创建该表格;
最后将文件保存到 savePath 目录中, 并返回生成文件的文件名.

```javascript
//
// 从应答数据集的 data 中获取填入表格中
//
var reportName = sys.setReportData(templateName, ["data"], tmpPath, downPatn);
//
// 数据集为两行两列, 表格头为 'id' 和 'name'
//
var reportName = sys.setReportData(templateName, [{'id': '00001', 'name': 'a'}, {'id': '00002', 'name': 'b'}], tmpPath, downPatn);
```


## sys.convertCsvToXls(fileName, csvString, templatePath, savePath, queryCondition, rowNum, columnNum)

未实现, 通过其他函数组合可以实现该函数的功能.


## sys.setRetList(array:plist, array:clist, array:associate, string:keyname)

将符合条件的 clist 中的元素附加到 plist 元素的 keyname 属性上.
associate 可以设置多个属性, 他们是 '并且' 的关系.
生成的 keyname 属性是一个数组, 数组中保存着复制来的 clist 中的元素.

参数:

* plist 元素是 object 对象
* clist 元素是 object 对象
* associate [[k1, k2],[...], ...] k1 是 plist 属性名, k2 是 clist 属性名.
* keyname 在 plist 中创建的数组属性名称


## sys.transformTreeData(array:tree, string:parentKey, string:childKey, string:key_name)

将平行的 list 数据转换为深层 tree 格式; 数据对象根据属性 `child_key` 来寻找含有
属性 `parent_key` 的数据对象, 并将自身附加到属性名 `keyname` 的数组上;
如果数据对象 `parent_key` 为 null, 则认为是根节点;
支持无限深层的 tree 数据格式.

参数:

* dataList 原始数据
* parent_key 父节点属性名称
* child_key 子节点属性名称
* key_name 生成的子节点数组


## sys.getRelatedTreeData(object:all, object:filter, string:parentAttr, string:childAttr)

禁止使用, 该算法有缺陷.


## sys.isEmpty(string|array|object:v)

参数为null、空字符串、空集合、空数组时，返回true, 否则返回 false.


## sys.toString(object:v)

将任意对象转换为字符串


## sys.toBool(object:v)

返回指定参数转换成的布尔值；1、"1"、true、"true" 大小写皆可 返回 true，否则返回 false.


## sys.format(string:formatString, array:parm)

将参数绑定到 formatString 字符串上, 并返回.

```javascript
//
// 返回 "hello xBoson"
//
sys.format("hello {0}", ['xBoson'])
```


## sys.currentTimeString(), sys.getCurrentTimeString()

返回当前日期+时间的字符串, 格式为 "yyyy-MM-dd HH:mm:ss".


## sys.charAt(...), sys.indexOf(...), sys.size(...), sys.startWith(..), sys.endWith(...), sys.length(..), sys.subStringTo(..), sys.subString(..), sys.split(..), sys.contain(..), sys.toUpperCase(..), sys.toLowerCase(..), sys.replace(..), sys.trim(..), sys.trunc(..), sys.httpGet(..)

这些方法不要再调用, 使用 js 原生方法替代.