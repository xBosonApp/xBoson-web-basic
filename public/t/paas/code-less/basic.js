module.exports = {
  bc001: {
    txt:'文本', 
    component:'span'
  },
  
  bc002: {
    txt:'标签', 
    component:'label'
  },
  
  bc003: {
    txt:'段落', 
    component:'p'
  },
  
  bc004: {
    txt:'标题1', 
    component:'h1'
  },
  
  bc005: {
    txt:'按钮', 
    component:'a-button',
    props: {
      disabled: {
        desc: '按钮失效状态',
        // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 5:来自变量
        type: 3,
        select: {true:'禁用', false:'启用'},
        def: false,
      },
      shape: {
        desc: '按钮形状',
        type: 3,
        select:{ round:'方形', circle:'圆形' },
      }
    }
  },
  
  bc006: {
    txt:'输入框', 
    component:'a-input',
    props: {
      placeholder: {
        desc: '提示',
        type: 1,
        def: '输入文本',
      },
    }
  },
  
  bc007: {
    txt:'分割线',
    component:'hr',
  },
  
  bc008: {
    txt: '格式化文本',
    component: 'pre',
  }
}