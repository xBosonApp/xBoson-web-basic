# 平台部署问题
 
与平台安装/部署相关的所有资料.
部署时遇到的问题与解决方案.
 
 
# 文件
 
* /home/plat             平台所有文件保存与于此, 用户权限 `plat:plat`
  + .installer
    - install.sh         平台安装脚本
    - backup.sh          平台备份脚本, root 用户运行, 备份文件保存在 `/root/plat.tgz`
    - info               连接链接到平台启动授权文件 `/home/plat/apache-tomcat-7.0.69/webapps/ds/WEB-INF/info`
  + apache-tomcat-x      应用程序
  + nginx                应用程序, 默认主页 index.html, 用户权限 `nginx`
  + node-config          node 配置文件
    - brewery-config     监控文件修改配置, 默认监控 `/home/plat/node-config/node-services-mix/web4node`
    - conductor-config   中心端配置
    - virtuoso-config    客户端配置
    - log-srv-prj        日志配置
    - node-services-mix  ui 配置
  + node-eeb-center      应用程序
  + node-eeb-client      应用程序
  + node-log-srv         日志中转
  + node-ui              ui 应用
  + node-X-linux-x64     应用程序
  + redis-X              应用程序
  + kafka_X              应用程序
  + web4node             ui 静态文件
  + change_logdb         ui 文件修改历史数据库
  + share_path           上传下载文件临时目录, 链接到 `/usr/local/share_path`
  + paasc.sh             配置文件显示脚本
  + paas.sh              服务管理脚本
  + killtom.sh           干掉 tomcat
  + set-env.sh           设置当前环境变量可执行 javac/java/node/npm
* /home/mysql            数据库文件, 用户权限 `mysql`


# 单机安装

0. 上传 plat.tgz 到目标服务器 (plat.tgz 使用 `./installer/backup.sh` 生成).
1. 将 plat.tgz 解压:
   `tar -xvpzf plat.tgz -C /`
2. 到 /home/plat/.install
   `./install.sh`
  

# 集群安装

## 共享目录

为文件上传下载配置网络共享目录映射，当保存文件的位置不在同一个服务器，  
或对核心进行集群时必须配置对应 file.properties 配置文件中的路径

```sh
mkdir /usr/local/share_path/
vi /etc/fstab
```

最后一行追加以下后保存
```
//192.168.7.19/zhirong/file/ /usr/local/src_share_path/ cifs defaults,auto,username=zhirong,password=zhirong
```

重启或执行以下命令
`sudo mount -a`


# 应用管理方法

## node

nodejs 服务使用命令 `npm test` 可以启动独占 console 的调试模式,
此时输出完整的日志方便调试, 停止这个服务需要使用组合键 `ctrl + c`;

## tomcat

tomcat 可以使用 `catalina.sh run` 启用独占 console 的调试模式,
使用 `ctrl + c` 有时不会终止进程, 需要 ps 出 java 的 pid, 之后
使用 `ps -9 pid` 来停止服务.

## paas

启动所有服务: `service paas start`
停止所有服务: `service paas stop`
所有服务状态: `service paas status`
随系统启停: `chkconfig --add paas`


# Q 问题 A


## 导出报表错误

当平台导出表功能报错, 说明缺少临时目录, 临时目录在  
`/usr/local/share_path`, 这个配置在 redis: `dsConfigCache:FILE_PATH_ROOT`  
中被指明, 每个机构需要创建一个对应的目录:  
`/usr/local/share_path/机构ID/{template | tmp | backup | chart}`  
在安装脚本 `install.sh` 中的函数 add_org 可以执行这个功能.


## Mysql 启动失败

1. 因改变了 datadir 的位置，selinux 发生安全异常。
    解决：终止 selinux
    
2. 硬恢复模式，/share 目录内容没更新导致不能读取消息文件, 报错：  
    [ERROR] Can't find messagefile '/usr/share/mysql/errmsg.sys'  
    解决：重装 mysql
    
3. datadir 目录没有给 mysql 用户权限  
    解决：`chmod -U mysql:mysql /home/mysql`
    
    
## Mysql 安装后启动报错:
  Starting MySQL. ERROR! The server quit without updating PID file
  (/home/mysql/server.247.pid).

解决方案:
  删除所有数据库数据文件: rm -rf /home/mysql/*
  解除安全:               setenforce 0
  初始化数据库:           mysql_install_db
  文件授权:               chown -R mysql:mysql /home/mysql
  启动数据库(成功):       service mysql start


## linux 系统时间错误

安装网络校时:
  yum -y install ntpdate

进行校时
  ntpdate asia.pool.ntp.org


## Nginx 正向代理

nginx 作为正向代理不能修改目标端口, 即使 url 中指明了目标端口,  
ng 仍然以配置中的端口作为目标端口, 暂时没有直接的解决方案, 一种  
方式是在 header 中存储目标端口, 在代理时做端口切换.



## kafka 启动失败

1.  之前可以启动, 重启后提示数据错误并退出,
    删除数据目录后重启, 数据目录默认在 /tmp/kafka-logs, /tmp/zookeeper

2.  FATAL Fatal error during KafkaServerStable startup.  
      Prepare to shutdown (kafka.server.KafkaServerStartable)  
      java.net.UnknownHostException: plantform.server:  
        plantform.server: 未知的名称或服务  
        
    因为无法解析 plantform.server 这个主机名, 解决方法  
    在 /etc/hosts 中添加 `127.0.0.1 plantform.server
    
3.  当需要外部连接 kafka 时,  
    找到 config/server.properties 中 host.name 一行,  
    设置配置为本机局域网(外网) ip 地址.  
    


## Node UI 启动失败

1.  提示 java 错误,  
    java 必须使用介质中提供的版本, 并且必须解压在   
    /home/plat/jdk1.7.0_80 目录  
    
2.  提示配置文件错误, 或服务启动后行为不正常.  
    服务必须以 plat 用户启动, 若以 root(或其他用户) 启动,  
    服务会尝试在 /root 目录(或用户目录)读取配置文件或创建默认配置,  
    此行为需要提前迁移配置文件, 或之后重新配置所有配置文件.


## nginx 补充库 (仍需测试)

启动 nginx 后缺少库文件, 则运行这个命令:

yum -y install libX11-devel.x86_64 libxml2-devel libxslt-devel \
  libjpeg-turbo.x86_64 libfontenc.x86_64 fontconfig.x86_64 \
  libpng.x86_64
  
  
## 平台应用问题


### ide 查看历史无效

(过时)主机的 web4node 目录迁移需要同步修改UI: `/ide/uiide/ide.js` basePathOnServer 变量.


### 更新主数据后, 缓存没有同步

调用 Api: `/缓存管理/缓存平台数据字典` 
地址: `/ds/api/platdict?app=26c0f25501d24c0993515d445e1215a5&mod=cacheinit`


## 使用 scp 复制到远程目录

`scp plat.tgz root@remote_ip:~/`

`scp key root@192.168.1.110:/home/plat/apache-tomcat-7.0.69/webapps/ds/WEB-INF/classes/`
`scp pc  root@192.168.1.110:/home/plat/apache-tomcat-7.0.69/webapps/ds/WEB-INF/classes/`

    