@echo on
echo 只导出 '平台机构' 和 '数据机构', 最小导出

set path=c:\Program Files\7-Zip;C:\Programs64\mysql-5.7.17-winx64\bin

set dump=mysqldump.exe
set zexe=7z.exe
set sqlout=%~dp0\xboson-db-dump-small.sql


%dump%  --user=root --host=127.0.0.1 --protocol=tcp --port=3306 --password --default-character-set=utf8 --skip-triggers --databases "a297dfacd7a84eab9656675f61750078" "61a9ba99b94a4325ac747b4a9263df68" > %sqlout%


IF ERRORLEVEL 1 pause