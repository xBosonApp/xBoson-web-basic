# 平台前端

* `public` 所有前端文件
* `shell-script` 外壳脚本目录
* `xboson-node-modules` 脚本扩展目录
* `webservice` WSDL 测试客户端


# 工具脚本

* dump-db-all.cmd -- 打包平台 DB 数据, 输出到 xboson-db-dump.sql.
* dump-db-small.cmd -- 最小平台 DB 数据, 输出到 xboson-db-dump-small.sql.
* dump-mongo.cmd -- 打包 MongoDB 数据, 输出到 mongo-bak.tar.gz.
* dump-web-all.cmd -- 打包 WEB 数据, 输出到 web4xboson-all.tar.gz.


# git

在 online 分支上合并远程 master 分支

`git merge origin/master`