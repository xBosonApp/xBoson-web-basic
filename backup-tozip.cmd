set path=c:\Program Files\7-Zip
set src=D:\down1\web4ds\*
set out=D:\down1\web4xboson-%TIME:~0,2%.%TIME:~3,2%.%TIME:~6,2%.7z
set zexe=7z.exe

del %out%
%zexe% a -xr!*\node_modules\* -xr!*\.git\* -x!*\.svn\* -x!*\*.o -x!.git\* -x!*.log  -t7z %out% %src% -r

pause