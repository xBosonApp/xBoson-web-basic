/* Create By xBoson System */
const fs = require("fs");
const path = require("path");

module.exports = {
  openOutfile,
  localFromCdn,
  formatName1,
};


const renderMapTemplate = `
module.exports = {js:{}, css:{}};

for (let cname in map) {
(function() {
  let cfg = map[cname];
  Vue.component(cname, ()=>{
    if (cfg.css) require(cfg.css, 1).then((ex)=>{
      module.exports.css[cname] = ex;
    });
    return require(cfg.js, 1).then(ex=>{
      module.exports.js[cname] = ex;
    });
  });
})();
}
`;


function openOutfile(name) {
  let out = fs.createWriteStream(path.join(__dirname, '/../loader/', name +'.js'));
  // 所有参数写出一行, 参数加空格, 末尾加换行
  out.push = function(...x) {
    x.forEach(t=>{
      out.write(t +' ');
    });
    out.write('\n');
    return out;
  };
  
  out._name = name;
  
  // 渲染标题
  out.title = function(t) {
    this.push("// xBoson generate", new Date());
    this.push("//", name, "Loader", t);
  }
  
  // map={ vue组件名 : { js: js文件路径, css: css文件路径 }}
  out.renderMap = function(map) {
    out.push("let map = ", JSON.stringify(map));
    out.push(renderMapTemplate);
  };
  
  return out;
}


function localFromCdn(_path) {
  return path.join(__dirname, '../../../', _path);
}


//
// za-xb-yc => ZaXbYc
//
function formatName1(n) {
  let buf = [];
  let up = true;
  for (let i=0; i<n.length; ++i) {
    if (n[i] == '-') {
      up = true;
      continue;
    }
    
    if (up) {
      buf.push(n[i].toUpperCase());
      up = false;
    } else {
      buf.push(n[i]);
    }
  }
  return buf.join('');
}