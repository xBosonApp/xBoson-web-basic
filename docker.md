# 准备

1. 创建 `~/xboson/` 目录.
2. 创建 `~/xboson/db` 目录, 并将 db-dump.sql 复制进这个目录.
2. 创建 `~/xboson/dbn` 目录, mysql 使用该目录存放数据, 必须为空目录.
3. 创建 `~/xboson/web` 目录, 并将 'public', 'shell-script', 'xboson-node-modules' 等目录复制进这个目录; public 是 UI 前端目录根文件夹, 里面有 t/ui/web 等子目录.
4. 创建 `~/xboson/app` 目录, 将 war 放入该目录.
5. 下载 jdk8 到 `~/xboson/java` 目录, 使该目录有 bin/jar 子目录.

```shell
mkdir ~/xboson/
mkdir ~/xboson/db
mkdir ~/xboson/dbn
mkdir ~/xboson/web
mkdir ~/xboson/app
mkdir ~/xboson/java
mkdir ~/xboson/config

# 下载 java8
wget http://download.oracle.com/otn-pub/java/jdk/8u162-b12/0da788060d494f5095bf8624735fa2f1/jdk-8u162-linux-x64.tar.gz
```

(Docker 中国官方镜像加速)[https://www.docker-cn.com/registry-mirror]


# docker

## run 运行容器

--link 容器名称:别名    在容器中使用别名访问另一个容器, 而不使用 ip 地址.
--name 容器名称
-v 本地目录:容器目录    将本地目录映射到容器中, 如果容器有这个目录会被遮盖.
-p 本地端口:容器端口    将容器中的端口映射到宿主机.
-e ?
-d 镜像名称:版本

## ps 列出运行中的容器


# Mysql 容器

每次安装都要替换掉密码.

```sh
docker pull mysql:5.7.8-rc

#
# 替换了配置文件 my.cnf, 映射数据到宿主机
#
docker run --name mysql-x \
  -v ~/xboson/config/my.cnf:/etc/mysql/my.cnf \
  -v ~/xboson/dbn:/var/lib/mysql \
  -v ~/xboson/db:/init-data \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=AYMAf3EZ5EQNKDIr3gTkX7IydQ \
  -d mysql:5.7.8-rc

#
# 导入初始化数据
#
mysql -uroot -pAYMAf3EZ5EQNKDIr3gTkX7IydQ < /init-data/xboson-db-dump.sql  
```


```sql
--
-- 修正数据源错误
--
update `a297dfacd7a84eab9656675f61750078`.sys_pl_drm_ds001 
    set dhost='mysql' 
    where dhost = 'localhost' or dhost = '127.0.0.1';
```


# Tomcat 容器

```sh
docker pull tomcat:9.0.4-jre8

#
# 覆盖了 webapps 目录, 替换 java, 映射配置文件目录到宿主机.
# 映射 web 目录到宿主机
#
docker run --name tomcat-x \
  --link mysql-x:mysql \
  --link redis-x:redis \
  --link mongo-x:mongo \
  -v ~/xboson/app:/usr/local/tomcat/webapps \
  -v ~/xboson/web:/web \
  -v ~/xboson/java:/docker-java-home \
  -v ~/xboson/config:/root/xBoson-config \
  -p 8800:8080 \
  -d tomcat:9.0.4-jre8
```


# Redis 容器

未设置权限

docker pull redis:4.0.7


# MongoDB 容器

未设置权限

docker pull mongo:3.6.2