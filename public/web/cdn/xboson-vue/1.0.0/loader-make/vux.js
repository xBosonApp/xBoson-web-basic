/* Create By xBoson System */

const tool = require("./tool.js");
const fs = require("fs");
const basepath = 'vux/2.9.6/components/';
const cdn = 'cdn/'+ basepath;

const out = tool.openOutfile('vux');
out.title(cdn);

let dir = fs.readdirSync(tool.localFromCdn(basepath));
let map = {};
  
dir.forEach((n, i)=>{
  let name = tool.formatName1(n);
  map['vue'+ name] = {
    css : cdn + n +'/index.min.css',
    js  : cdn + n +'/index.min.js',
  };
});

out.renderMap(map);