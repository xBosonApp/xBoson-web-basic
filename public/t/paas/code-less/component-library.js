/* Create By xBoson System */

// 分类存放
let componentLibrary = [];
// 扁平存放
let componentAll = {};
// {分组名: []}
let componentLite = [];


function loadLib(title, list) {
  for (let id in list) {
    list[id].id = id;
  }
  
  componentLibrary.push({
    title,
    list,
  });
  
  componentLite.push({
    title, 
    group : toLite(list),
  });
  
  for (let n in list) {
    if (componentAll[n]) {
      throw new Error("组件 "+ n +'冲突, 在 '+ title);
    }
    componentAll[n] = list[n];
  }
}


function toLite(list) {
  let group = {};
  
  for (let i in list) {
    let item = list[i];
    let gname = item.groupName || '通用';
    
    let g = group[gname];
    if (!g) {
      g = group[gname] = [];
    }
    
    g.push({
      id : i,
      txt: item.txt,
    });
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


module.exports = {
  loadLib,
  getLibrary,
  getComponent,
}