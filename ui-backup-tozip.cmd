set path=c:\Program Files\7-Zip
set src=%~dp0\*
set out=P:\[project-backup]\xboson\web4xboson-%DATE:~0,4%.%DATE:~5,2%.%DATE:~8,2%.7z
set zexe=7z.exe

del %out%
%zexe% a  -xr!*\.git\* -x!*\.svn\* -x!*\*.o -x!.git\* -x!*.log -x!*.7z -x!xboson-db-dump.sql  -t7z %out% %src% -r

pause