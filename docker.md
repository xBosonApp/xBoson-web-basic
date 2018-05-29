# 准备

1. 创建 `~/xboson/` 目录.
2. 创建 `~/xboson/db` 目录, 并将 db-dump.sql 复制进这个目录.
2. 创建 `~/xboson/dbn` 目录, mysql 使用该目录存放数据, 必须为空目录.
3. 创建 `~/xboson/web` 目录, 并将 'public', 'shell-script', 'xboson-node-modules' 等目录复制进这个目录; public 是 UI 前端目录根文件夹, 里面有 t/ui/web 等子目录.
4. 创建 `~/xboson/app` 目录, 将 war 放入该目录.
4. 创建 `~/xboson/nginx`
5. 创建 `~/xboson/node-config` 目录
5. 下载 jdk8 到 `~/xboson/java` 目录, 使该目录有 bin/jar 子目录.

```shell
mkdir ~/xboson/
mkdir ~/xboson/db
mkdir ~/xboson/dbn
mkdir ~/xboson/web
mkdir ~/xboson/app
mkdir ~/xboson/java
mkdir ~/xboson/config
```

# 下载 jdk8
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html


(Docker 中国官方镜像加速)[https://www.docker-cn.com/registry-mirror]


# docker

安装镜像时, 在镜像名称前加上 `registry.docker-cn.com/` 可以提升下载速度.

## run 运行容器

--link 容器名称:别名    在容器中使用别名访问另一个容器, 而不使用 ip 地址.
--name 容器名称
-v 宿主目录:容器目录    将本地目录映射到容器中, 如果容器有这个目录会被遮盖.
-p 宿主端口:容器端口    将容器中的端口映射到宿主机.
-e 环境变量设置
-d 镜像名称:版本

## ps 列出运行中的容器


## 启动一个 centos 容器, 用于调试

 docker run -d -i --name ct7 -v /etc/ssh:/sshconfig  centos:7 /bin/bash


# Mysql 容器

为了安全每次安装都要替换掉密码;
进入容器后 /init-data 目录为 sql 导入/初始化脚本,
在宿主机 ~/xboson/dbn 目录上传该初始化脚本;

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
  -e TZ="Asia/Shanghai" \
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
  -p 8083:8080 \
  -e TZ="Asia/Shanghai" \
  -d tomcat:9.0.4-jre8
```

修正系统时区:

`cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime`


# ETL/ESB 容器

## make container

docker run --name etl -d -i --link mysql-x:mysql \
  -v ~/xboson/:/root -p 8012:8012 -d centos:7 /bin/bash

解压 plat 文件，解压 etl/esb 相关文件

docker exec -it etl /bin/bash

docker commit etl etl-base


## make center server

docker run --name etl-center -d -i --link mysql-x:mysql \
  -v ~/xboson/:/root -p 8012:8012 -p 8013:8013 -d etl-base /bin/bash

docker exec -t etl-center /bin/bash


## make client

docker run --name etl-client -d -i --link redis-x:redis \
  --link etl-center:etl-center \
  -v ~/xboson/:/root -d etl-base /bin/bash

docker exec -t etl-client /bin/bash

cd /etl/virtuoso/bin



# Redis 容器

未设置权限

docker pull redis:4.0.7


# MongoDB 容器

未设置权限

docker pull mongo:3.6.2


# Nginx 容器

创建并启动容器, 注意: 映射的端口内外一致, 否则跳转会出错.

```sh
docker run \
  --name nginx-x \
  -d -p 8800:8800 \
  -v ~/xboson/nginx:/etc/nginx/conf.d \
  --link etl-center:etlcenter \
  --link etl-client:etlclient \
  --link tomcat-x:xboson \
  nginx
```


# Git Server

https://hub.docker.com/r/sameersbn/gitlab/

为 Git 服务器创建单独的 Mysql
```sh
docker run --name gitlab-mysql -d \
    --env 'DB_NAME=gitlabhq_production' \
    --env 'DB_USER=gitlab' \
    --env 'DB_PASS=8f024f54a4e59bdd69dc' \
    --volume ~/git-server/mysql:/var/lib/mysql \
    sameersbn/mysql
```


配置单独的 redis
```sh
docker run --name gitlab-redis -d \
    --volume ~/git-server/redis:/var/lib/redis \
    sameersbn/redis:latest
```


启动镜像, 将应用映射到 '/git0' 路径 (10.5.0 有 bug.).
```sh
docker run --name gitlab-srv -d \
    --volume ~/git-server/data:/home/git/data \
    --link gitlab-mysql:mysql \
    --link gitlab-redis:redisio \
    --env 'GITLAB_RELATIVE_URL_ROOT=/git0' \
    --env 'GITLAB_CI_SECRETS_DB_KEY_BASE=填入64字符以上密钥' \
    --env 'GITLAB_SECRETS_DB_KEY_BASE=填入64字符以上密钥' \
    --env 'GITLAB_SECRETS_SECRET_KEY_BASE=填入64字符以上密钥' \
    --env 'GITLAB_SECRETS_OTP_KEY_BASE=填入64字符以上密钥' \
    -p 10022:22 \
    -p 10080:80 \
    sameersbn/gitlab:10.3.0
```


