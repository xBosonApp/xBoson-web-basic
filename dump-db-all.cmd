@echo on

set path=%path%;c:\Program Files\7-Zip;D:\_dev_runtime\mysql-5.7.17-winx64\bin

set dump=mysqldump.exe
set zexe=7z.exe
set sqlout=%~dp0\dump.db
set zipout=g:\[project-backup]\xboson\xboson-db-dump-%DATE:~0,4%.%DATE:~5,2%.%DATE:~8,2%.7z


%dump%  --user=root --host=127.0.0.1 --protocol=tcp --port=3306 --password --default-character-set=utf8 --skip-triggers --databases "afb9a9a1c80647e6a0d7e807f68e055a" "a297dfacd7a84eab9656675f61750078" "bc02994ec23341708e54c97f6b3f9f48" "fd0ec7186f9247daac2b3183b8782081" "eeb" "61a9ba99b94a4325ac747b4a9263df68" "qyyws" > %sqlout%

%zexe% a -t7z %zipout% %sqlout% 


IF ERRORLEVEL 1 pause