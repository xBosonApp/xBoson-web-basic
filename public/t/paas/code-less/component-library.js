/* Create By xBoson System */
const tool = require("./tool.js");

// 扁平存放
const componentAll = {};
// [ {title分组名: [], id:'' ...} ]
const componentLite = [];


module.exports = {
  loadLib,
  getLibrary,
  getComponent,
  fixId,
  setClassify,
  findGroups,
  loadStaticLib,
  loadClassify,
  loadComponent : _load_component,
  makeComponentPluginLoader,
  saveLibRequires,
};


//
// 添加分类, 和分类组列表
// title      - String
// groupNames - Array[String] | Map{ name: [] }
// requires   - Array[String: 文件列表]
//
function setClassify(id, title, groupNames, requires, _contentLoader) {
  let i = componentLite.findIndex((c)=> c.id == id);
  let group = {};
  
  if (Array.isArray(groupNames)) {
    groupNames.forEach(n=>{ group[n] = [] });
  } else {
    group = groupNames;
  }
  
  let lite = {
    id,
    title,
    group,
    requires,
    
    contentLoader() {
      return new Promise((ok, fail)=>{
        _contentLoader(ok, fail, id);
      });
    },
  };
  
  if (i < 0) {
    componentLite.push(lite);
  } else {
    componentLite[i] = lite;
  }
  
  componentLite.sort((a, b)=>{
    return a.title<b.title ? -1 : a.title>b.title ? 1 : 0;
  });
}


function saveLibRequires(clid, targetMap) {
  let lib = _find_lib(clid);
  if (lib.requires) {
    for (let i=0; i<lib.requires.length; ++i) {
      targetMap[ lib.requires[i] ] = 1;
    }
  }
  return targetMap;
}


function fixId(list) {
  if (Array.isArray(list)) {
    for (let i=0; i<list.length; ++i) {
      list[i].id = list[i]._id;
    }
  }
  else {
    for (let id in list) {
      list[id].id = id;
    }
  }
}


function _find_lib(id) {
  let lib = componentLite.find((lib)=> lib.id == id);
  if (!lib) {
    throw new Error("组件库未设置 ID:"+ id);
  }
  return lib;
}


//
// list - { id: { id, txt, component, ...} }
//
function loadLib(id, list) {
  let lib = _find_lib(id);
  
  for (let n in list) {
    let g = lib.group[ list[n].groupName ];
    let idx = g.findIndex(i=>{ return i.id == list[n].id });

    if (idx >= 0) {
      g[idx] = list[n];
    } else {
      g.push(list[n]);
    }
    
    if (componentAll[n]) {
      console.debug("Replease", n, 'in', lib.title);
    }
    componentAll[n] = list[n];
    componentAll[n].clid = id;
  }
}


function findGroups(list) {
  let group = {};
  
  for (let i in list) {
    let item = list[i];
    let gname = item.groupName || '通用';
    
    let g = group[gname];
    if (!g) {
      g = group[gname] = [];
    }
  }
  return group;
}


function getLibrary() {
  return componentLite;
}


function getComponent(id) {
  let c = componentAll[id];
  if (!c) {
    throw new Error("component not found "+ id);
  }
  return c;
}


function makeComponentPluginLoader(id, targer) {
  let c = getComponent(id);
  let p = targer || {};
  for (let n in c.plugins) {
    Vue.set(p, n, require(c.plugins[n], 1, 1));
    console.debug("Load component plugin", id, n, ':', c.plugins[n])
  }
  return p;
}


function loadStaticLib(name, path) {
  require(path, 1).then(function(list) {
    fixId(list);
    let gp = findGroups(list);
    let id = path;
    
    setClassify(id, name, gp, null, (ok)=>{
      loadLib(id, list);
      ok();
    });
  });
}


function loadClassify() {
  return new Promise((ok, fail)=>{
    tool.api('register', 'list_c_lib', {}, (err, ret)=>{
      if (err) throw fail(err);
      
      ret.data.forEach(c=>{
        setClassify(c._id, c.name, c.groups, c.requires, loadComponent);
      });
      
      ok();
    });
  });
}


function _load_component(clid) {
  return _find_lib(clid).contentLoader();
}


function _load_requires(clid) {
  return new Promise((ok, fail)=>{
    let lib = _find_lib(clid);
    let i = -1;
    next();
    
    function next() {
      if (++i < lib.requires.length) {
        require(lib.requires[i], 1).catch(fail).then(next);
      } else {
        ok();
      }
    }
  });
}


function loadComponent(ok, fail, clid) {
  tool.api('register', 'list_c_bind', {clid}, (err, ret)=>{
    if (err) return fail(err);
    
    let cs = {};
    ret.data.forEach(b=>{
      cs[b._id] = b;
      b.id = b._id;
    });
    loadLib(clid, cs);
    
    _load_requires(clid).then(ok).catch(fail);
  });
}