//
// 生成 uglify-js 的压缩版
// 保证 uglify-js 已经安装到上层目录(node模块目录)
//
const node = require("uglify-js/tools/node.js");
const fs = require('fs');
const plib = require("path");

const packagejson = {
  "name": "uglify-js-min",
  "version": "1.0.0",
  "description": "该项目来自 uglify-js",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "yanming",
  "license": "ISC"
};

const readme = `
# javascript 代码混淆压缩

该项目来自 uglify-js 是它的压缩版.
由于平台不支持完整的 node(es6) 特性而生成此项目.

## 生成

1. 安装 uglify-js 模块
2. 执行 build-uglify.js 生成 uglify-js-min
3. 项目中 require('uglify-js-min')
`;

const basedir = plib.join(__dirname, './node_modules/uglify-js-min/');

fs.mkdirSync(basedir, {recursive: true});
fs.writeFileSync(basedir +'/README.md', readme);
fs.writeFileSync(basedir +'/package.json', JSON.stringify(packagejson, 0, 2));


var code = [];

code.push('"use strict";');
code.push("(function() { var MOZ_SourceMap = require('source-map');");

node.FILES.forEach(function(file) {
  console.log('Code File', file);
  code.push( fs.readFileSync(file, "utf8") );
});

// 暂时无用
//code.push("exports.describe_ast = " + describe_ast.toString());

code.push('})()');
console.log('Min...........');
var res = node.minify(code.join("\n\n"));

if (res.error) {
  console.error(res.error);
  return;
}

fs.writeFileSync(basedir +'/index.js', res.code);
