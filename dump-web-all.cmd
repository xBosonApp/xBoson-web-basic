tar -czvpf web4xboson-all.tar.gz public shell-script webservice xboson-node-modules 2>tar-all.log

cp web4xboson-all.tar.gz g:\[project-backup]\xboson\xboson-web-dump-%DATE:~0,4%.%DATE:~5,2%.%DATE:~8,2%.tar.gz

echo OK.
echo tar -xzvf web4xboson-all.tar.gz
pause