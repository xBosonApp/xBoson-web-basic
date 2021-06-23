const tool = require('./tool.js');

module.exports = {
  createInstance,
};


function createInstance(root, component) {
  let cfg = newInstance(root, component);
  initProps(component, cfg.props);
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
  let containerStyle = component.isContainer && component.containerStyle;
  let props = {
    // 组件实例的样式
    style: component.style || {},
    // 如果是组件容器, 表示内嵌组建列表
    nestedList,
  };
  return {
    id : genID(root, component),
    note : '',
    // 标签属性
    props,
    // 事件函数列表
    on : {},
    // 平台组件id
    cid : component.id,
    // 标签文本
    txt : component.removeTxt ?'' :component.txt,
    // 删除与标签文本相关的数据
    removeTxt : component.removeTxt,
    // vue 组件名, 可以是 html 标签名, 是最终渲染时的标签.
    component : component.component,
    // 在设计时使用这个 tag 进行辅助
    helpTag : component.helpTag,
    // 组件的实例
    isInstance : true,
    // true 表示一个组件容器, 容器中可拖拽组件
    isContainer : component.isContainer,
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
function initProps(c, props) {
  for (let n in c.props) {
    let p = c.props[n];
    if (props[n] !== undefined) continue; 
    if (p.def) {
      props[n] = tool.deepCopy(p.def);
    } 
    else {
      // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 
      // 5:来自变量, 6:图标选择, 7:自定义组件
      switch (p.type) {
        case 1:
        case 4:
          props[n] = ''; break;
        case 2:
          props[n] = 0; break;
        case 3:
        case 5:
        case 6:
        case 7:
          props[n] = null; break;
        default:
          throw new Error("init props invaild type val:"+ n);
      }
    }
  }
}