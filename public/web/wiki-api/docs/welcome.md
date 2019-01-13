# xBoson API WIKI

该文档为开发文档, 包含所有在服务端脚本开发时使用到的 API.

## Hello World

用浏览器打开在线 IDE 开始写一个 API 脚本, 这个脚本将在服务器端运行,   
它连接 DB 并返回 DB 查询结果, 通过 Http 协议返回给客户端.

```javascript
"use strict";
// DBMS 返回的 Hello World !
sql.query("Select 'Hello World !' message", null, 'res');
// 查询结果按照名称 (res) 绑定到 sys.result 上
sys.setRetData(0, sys.result.res[0].message);
```