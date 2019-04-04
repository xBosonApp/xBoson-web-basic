@echo on

set PATH=D:\MongoDB\3.6\bin;%PATH%
set OUT=P:\[project-backup]\xboson\xboson-mongo-dump-%DATE:~0,4%.%DATE:~5,2%.%DATE:~8,2%.tar.gz

mongodump -h 127.0.0.1 -o mongo-bak
tar -czvpf mongo-bak.tar.gz mongo-bak
rm -rf mongo-bak

cp mongo-bak.tar.gz %OUT%

echo DONE
pause

rem 在服务器上执行 mongorestore --dir bak 恢复数据