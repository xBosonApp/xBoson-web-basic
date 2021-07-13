/* Create By xBoson System */
const tool = require("./tool.js");

// 扁平存放
const componentAll = {};
// {分组名: []}
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
};


//
// 添加分类, 和分类组列表
// title      - String
// groupNames - Array[String] | Map{ name: [] }
// requires   - Array[String: 文件列表]
//
function setClassify(id, title, groupNames, requires, _contentLoader) {
  let i = componentLite.findIndex((t)=> t == title);
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


//
// list - { id: { id, txt, component, ...} }
//
function loadLib(id, list, _replace_exists) {
  let lib = componentLite.find((lib)=> lib.id == id);
  if (!lib) {
    throw new Error("组件库未设置 ID:"+ id);
  }
  
  for (let n in list) {
    let g = lib.group[ list[n].groupName ];
    let idx = g.findIndex(i=>{ return i.id == list[n].id });

    if (idx >= 0) {
      g[idx] = list[n];
    } else {
      g.push(list[n]);
    }
    
    if (_replace_exists == null && componentAll[n]) {
      throw new Error("组件 "+ n +'冲突, 在 '+ lib.title);
    }
    componentAll[n] = list[n];
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
    
    // g.push({
    //   id : i,
    //   txt: item.txt,
    // });
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


function loadComponent(ok, fail, clid) {
  tool.api('register', 'list_c_bind', {clid}, (err, ret)=>{
    if (err) return fail(err);
    
    let cs = {};
    ret.data.forEach(b=>{
      cs[b._id] = b;
      b.id = b._id;
    });
    loadLib(clid, cs);
    
    ok();
  });
}