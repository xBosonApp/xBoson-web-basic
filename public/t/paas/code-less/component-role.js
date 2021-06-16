module.exports = {
  createInstance,
};


function createInstance(component) {
  let cfg = newInstance(component);
  initProps(component, cfg.props);
  return cfg;
}


//
// 创建组建实力对象
//
function newInstance(component) {
  return {
    // id        : component.id,
    props     : { style:{} },         // 标签属性
    on        : {},                   // 事件函数列表
    cid       : component.id,         // 平台组件id
    txt       : component.txt,        // 标签文本
    component : component.component,  // vue 组件名
    isInstance: true,
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
}