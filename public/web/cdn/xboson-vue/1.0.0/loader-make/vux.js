/* Create By xBoson System */

const tool = require("./tool.js");
const fs = require("fs");
const basepath = 'vux/2.9.6';
const components = basepath +'/components/';
const plugins = basepath +'/plugins/';

const out = tool.openOutfile('vux');
out.title(components +','+ plugins);

let dir = fs.readdirSync(tool.localFromCdn(components));
let map = {};
  
dir.forEach((n, i)=>{
  let name = tool.formatName1(n);
  let path = 'cdn/'+ components + n;
  
  map['vue'+ name] = {
    css : path +'/index.min.css',
    js  : path +'/index.min.js',
  };
});

out.renderMap(map);


let plugin = fs.readdirSync(tool.localFromCdn(plugins));
let pmap = [];
let skip_plugin = {'docs':1, ' wechat':1, 'ajax':1};

plugin.forEach(n=>{
  if (skip_plugin[n]) return;
  let path = 'cdn/'+ plugins + n;
  
  pmap.push({
    name : n,
    css  : path +'/index.min.css',
    js   : path +'/index.min.js',
  });
});

out.renderUses(pmap);