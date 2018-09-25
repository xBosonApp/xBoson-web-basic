@echo on

set PATH=D:\MongoDB\3.6\bin;%PATH%

mongodump -h 127.0.0.1 -o mongo-bak

echo DONE
pause