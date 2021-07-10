tar -x web-small.filelist -czvpf web4xboson-all.tar.gz public shell-script webservice xboson-node-modules 2>tar-small.log

echo OK.
IF ERRORLEVEL 1 pause