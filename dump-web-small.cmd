tar --exclude-from=web-small.filelist -czvpf web4xboson-sm.tar.gz public shell-script webservice xboson-node-modules 2>tar-small.log

IF ERRORLEVEL 1 pause