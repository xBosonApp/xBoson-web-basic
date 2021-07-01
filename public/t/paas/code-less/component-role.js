const tool = require('./tool.js');

module.exports = {
  createInstance,
};


function createInstance(root, component) {
  let cfg = newInstance(root, component);
  initProps(component, cfg);
  marginPlugin(root, component);
  return cfg;
}


function genID(root, component) {
  return component.txt +'-'+ (++root.id);
}


function marginPlugin(root, comp) {
  let p = root.plugins;
  if (!p) {
    p = root.plugins = {};
  }
  for (let n in comp.plugins) {
    p[n] = comp.plugins[n];
  }
}


//
// 创建组建实例对象
//
function newInstance(root, component) {
  let nestedList = component.isContainer && [];
  // let containerStyle = component.isContainer && component.containerStyle;
  let props = {
    style: component.style || {},
    nestedList,
  };
  
  let propsConfig = {
    style       : { type:'design' },
    nestedList  : { type:'design' },
  };
  
  return {
    id : genID(root, component),
    note : '',
    props,
    propsConfig,
    cid : component.id,
    txt : component.removeTxt ?'' :component.txt,
    removeTxt : component.removeTxt,
    component : component.component,
    helpTag : component.helpTag,
    isInstance : true,
    isContainer : component.isContainer,
    bindStyle : {},
  }
}


//
// 用指定的组件初始化属性实例列表
// 属性:
// desc: '按钮失效状态',                -- 文字说明
// type: 3,                             -- 处理类型
// select: {true:'禁用', false:'启用'}, -- 类型 3,4 的选项列表
// def: false,                          -- 默认值
// min: 0, max:10,                      -- 数字最大最小值, 字符串长度限制
//
function initProps(c, cfg) {
  for (let n in c.props) {
    let p = c.props[n];
    if (!cfg.propsConfig[n]) {
      cfg.propsConfig[n] = p.propsConfig || {
        type        : 'attribute',
        varType     : 'constant', 
        ref         : null,
        expr        : null,
        callParams  : [],
      };
    }
    
    if (cfg.props[n] !== undefined) continue; 
    if (p.def) {
      cfg.props[n] = tool.deepCopy(p.def);
    } 
    else {
      switch (p.type) {
        case 1: // 字符串(允许变量), 
        case 4: // 字符串,并且带有select选项, 
          cfg.props[n] = ''; break;
        case 2: // 整数(允许变量), 
          cfg.props[n] = 0; break;
        case 3: // 选项select属性, 
        case 5: // 变量(废弃)
        case 6: // 图标选择, 
        case 7: // 自定义组件
          cfg.props[n] = null; break;
        default:
          throw new Error("init props invaild type val:"+ n);
      }
    }
  }
}