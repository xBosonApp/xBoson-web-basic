/* Create By xBoson System */
const fs = require("fs");
const path = require("path");

module.exports = {
  openOutfile,
  localFromCdn,
  formatName1,
};


const renderMapTemplate = `
module.exports = Object.assign(module.exports, {js:{}, css:{}});

for (let cname in map) {
(function() {
  let cfg = map[cname];
  if (!cfg.js) {
    throw new Error(".js is null on "+ cname);
  }
  
  Vue.component(cname, ()=>{
    if (cfg.css) require(cfg.css, 1).then((ex)=>{
      module.exports.css[cname] = ex;
    });
    return require(cfg.js, 1).then(ex=>{
      return module.exports.js[cname] = ex;
    });
  });
})();
}
`;

const renderUsesTemplate = `
module.exports = Object.assign(module.exports, {use:{}});

use.forEach((u, i)=>{
  if (!u.name) {
    throw new Error(".name is null on "+ i);
  }
  if (!u.js) {
    throw new Error(".js is null on"+ u.name);
  }
  
  require(u.js, 1).then(ex=>{
    let mex = module.exports.use[u.name] = {js:ex};
    Vue.use(ex);
    
    if (u.css) {
      require(u.css, 1).then(c=>{
        mex.css = c;
      });
    }
  })
});
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
  };
  
  // 用于延迟加载组件
  // map={ vue组件名 : { js: js文件路径, css: css文件路径 }}
  out.renderMap = function(map) {
    out.push("var map = ", JSON.stringify(map));
    out.push(renderMapTemplate);
  };
  
  // 用于延迟加载插件
  // arr=[{ name, js, css }]; 
  out.renderUses = function(arr) {
    out.push('var use = ', JSON.stringify(arr));
    out.push(renderUsesTemplate);
  }
  
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