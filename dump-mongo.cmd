@echo on

set PATH=D:\MongoDB\3.6\bin;%PATH%

mongodump -h 127.0.0.1 -o mongo-bak

echo DONE
pause

rem 在服务器上执行 mongorestore --dir bak 恢复数据