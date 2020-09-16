
set target=D:\javaee-project\xboson-docker\$upload

rem 移动 db/web/war 到 docker 目录中

mv dump.db %target%\db\
mv web4xboson*.tar.gz %target%\web\
mv D:\javaee-project\xBoson\build\libs\xboson.war %target%\app\

pause