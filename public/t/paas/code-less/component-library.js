/* Create By xBoson System */

// 分类存放
let componentLibrary = [];
// 扁平存放
let componentAll = {};
// 精简存放
let componentLite = [];


function loadLib(title, list) {
  componentLibrary.push({
    title,
    list,
  });
  
  componentLite.push({
    title, 
    list : toLite(list),
  })
  
  for (let n in list) {
    if (componentAll[n]) {
      throw new Error("组件 "+ n +'冲突, 在 '+ title);
    }
    componentAll[n] = list[n];
  }
}


function toLite(list) {
  let lite = [];
  for (let i in list) {
    lite.push({
      id : i,
      txt: list[i].txt,
    });
  }
  return lite;
}


function getLibrary() {
  return componentLite;
}


function getComponent(id) {
  return componentAll[id];
}


//
// 属性:
// desc: '按钮失效状态',                -- 文字说明
// type: 3,                             -- 处理类型
// select: {true:'禁用', false:'启用'}, -- 类型 3,4 的选项列表
// def: false,                          -- 默认值
// min: 0, max:10,                      -- 数字最大最小值, 字符串长度限制
//
function initProps(id, props) {
  const c = getComponent(id);
  
  for (let n in c.props) {
    let p = c.props[n];
    if (p.def) {
      props[n] = p.def;
    } 
    else {
      // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 5:来自变量, 6:图标选择
      switch (p.type) {
        case 1:
        case 4:
          props[n] = ''; break;
        case 2:
          props[n] = 0; break;
        case 3:
        case 5:
        case 6:
          props[n] = null; break;
        default:
          throw new Error("无效的值类型");
      }
    }
  }
  
  if (!props.style) {
    props.style = {};
  }
}


module.exports = {
  loadLib,
  getLibrary,
  getComponent,
  initProps,
}