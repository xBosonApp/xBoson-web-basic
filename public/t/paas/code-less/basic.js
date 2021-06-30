module.exports = {
  bc001: {
    txt:'文本', 
    component:'span',
    groupName: '文本',
  },
  
  bc002: {
    txt:'标签', 
    component:'label',
    groupName: '文本',
    style: {
      'display': 'inline-flex',
      'align-items': 'center',
      'justify-content': 'flex-end',
    },
  },
  
  bc003: {
    txt:'段落', 
    component:'p',
    groupName: '文本',
  },
  
  bc004: {
    txt:'标题1', 
    component:'h1',
    groupName: '文本',
  },
  
  bc004h2: {
    txt:'标题2', 
    component:'h2',
    groupName: '文本',
  },
  
  bc004h3: {
    txt:'标题3', 
    component:'h3',
    groupName: '文本',
  },
  
  bc004h4: {
    txt:'标题4', 
    component:'h4',
    groupName: '文本',
  },
  
  bc004h5: {
    txt:'标题5', 
    component:'h5',
    groupName: '文本',
  },
  
  bc004h6: {
    txt:'标题6', 
    component:'h6',
    groupName: '文本',
  },
  
  bc005: {
    txt:'按钮', 
    component:'a-button',
    groupName: '表单',
    props: {
      disabled: {
        desc: '按钮失效状态',
        type: 3,
        select: {'禁用':true, '启用':false},
        def: false,
      },
      shape: {
        desc: '按钮形状',
        type: 3,
        select:{ '方形':'round', '圆形':'circle' },
      },
      icon: {
        desc: '图标类型',
        type: 6,
      },
      loading: {
        desc: '显示加载中',
        type: 3,
        select:{"加载中":true, '正常':false},
      }
    }
  },
  
  bc006: {
    txt:'输入框', 
    component:'a-input',
    groupName: '表单',
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
    removeTxt: true,
    groupName: '布局',
  },
  
  bc008: {
    txt: '格式化文本',
    component: 'pre',
    groupName: '文本',
  },
  
  bc009: {
    txt: '网格布局',
    component: 'div',
    groupName: '布局',
    helpTag: 'cl-grid',
    isContainer: true,
    removeTxt: true,
    plugins: {
      'cl-grid': './cl-grid.vue',
      'cl-css-grid-val': './cl-css-grid-val.vue',
    },
    props: {
      rows: {
        // 类型7必须有 component 属性, props 是可选的
        desc: '行设置',
        type: 7,
        component: 'cl-css-grid-val',
        props: {},
        propsConfig: {type:'design'},
      },
      columns: {
        desc: '列设置',
        type: 7,
        component: 'cl-css-grid-val',
        def : ['auto', 'auto'],
        propsConfig: {type:'design'},
      },
      rowGap: {
        desc: '行间隙',
        type: 7,
        def: '2px',
        component: 'cl-css-number',
        propsConfig: {type:'design'},
      },
      columnGap: {
        desc: '列间隙',
        type: 7,
        def: '2px',
        component: 'cl-css-number',
        propsConfig: {type:'design'},
      },
    },
    style: {
      'display': 'grid',
      'grid-template-rows': 'auto',
      'grid-template-columns': 'auto auto',
    },
  }
}