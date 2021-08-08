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
  
  bc004iframe: {
    txt: '内嵌框架',
    component:'iframe',
    groupName: '文本',
    helpTag: 'div',
    props: {
      src: {
        desc: '引用页面 URL',
        type: 1,
        def: 'http://',
      },
    },
    style: {
      'border': 0,
      'margin': 0,
      'padding': 0,
      'width': '100%',
      'height': '150px',
    },
  },
  
  bc005: {
    txt:'按钮', 
    component:'button',
    groupName: '表单',
    props: {
      disabled: {
        desc: '按钮失效状态',
        type: 3,
        select: {'禁用':true, '启用':false},
        def: false,
        propsConfig: {isExprAttr:true},
      },
      click: {
        desc: '左键单击事件',
        type: 8,
        propsConfig: {type:'event'},
      },
    }
  },
  
  bc006: {
    txt:'输入框', 
    component:'input',
    removeTxt: true,
    groupName: '表单',
    props: {
      placeholder: {
        desc: '提示',
        type: 1,
        def: '输入文本',
        canDynamic: true,
      },
    }
  },
  
  bc007: {
    txt:'分割线',
    component:'hr',
    removeTxt: true,
    groupName: '布局',
    helpTag: 'div',
    style: {
      height: '10px',
    }
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
  },
  
  bc010: {
    txt: '虚拟跳转', 
    component: 'router-link',
    helpTag: 'a',
    groupName: '文本',
    props: {
      to: {
        desc: '跳转到虚拟路径',
        type: 1,
      },
    },
  },
  
  bc011: {
    txt:'登陆表单', 
    component:'x-login-form',
    groupName: '表单',
    // helpTag: 'div',
  },
  
  bc012: {
    txt: '插槽',
    component: 'slot',
    groupName: '功能',
    isContainer: true,
    removeTxt: true,
    helpTag: 'div',
    props: {
      name: {
        desc: '插槽名称',
        type: 1,
      },
    }
  },
  
  bc013: {
    txt: '动态组件',
    component: 'component',
    groupName: '功能',
    props: {
      is: {
        desc: '组件名',
        type: 1,
        canDynamic: true,
        def: 'div',
      },
    }
  },
  
  bc014: {
    txt: "平台接口",
    component: 'x-api',
    helpTag: 'div',
    groupName: '功能',
    plugins: {
      'cl-select-api': './cl-select-api.vue',
    },
    props: {
      org: {
        desc: '机构',
        type: 9,
        canDynamic: true,
      },
      app: {
        desc: '应用',
        type: 9, 
        canDynamic: true,
      },
      mod: {
        desc: '模块',
        type: 9, 
        canDynamic: true,
      },
      api: {
        desc: 'API',
        type: 7, 
        // canDynamic: true,
        component: 'cl-select-api',
      },
      showMsg: {
        desc: '异常信息提示',
        type: 3,
        select: {'有提示':true, '无提示':false},
        def: false,
        propsConfig: {isExprAttr:true},
      },
      params: {
        desc: '接口请求参数',
        type: 1,
        canDynamic: true,
      },
      immediately: {
        desc: '页面加载时',
        type: 3,
        select: {'立即请求接口':true, '无动作':false},
        def: false,
      },
      flag: {
        desc: '更新标志',
        type: 1,
        canDynamic: true,
      },
      success: {
        desc: '接口成功返回 回调函数',
        type: 8,
        propsConfig: {type:'event'},
      },
      error: {
        desc: '接口失败返回 回调函数',
        type: 8,
        propsConfig: {type:'event'},
      },
    },
  },
  
  bc015: {
    txt: "通用接口",
    component: 'x-api-comm',
    helpTag: 'div',
    groupName: '功能',
    props: {
      url : {
        desc: '接口 URL',
        type: 1,
        canDynamic: true,
      },
      body : {
        desc: 'HTTP Body',
        type: 1,
        canDynamic: true,
      },
      params : {
        desc: "URL 参数",
        type: 1,
        canDynamic: true,
      },
      immediately: {
        desc: '页面加载时',
        type: 3,
        select: {'立即请求接口':true, '无动作':false},
        def: false,
        propsConfig: {isExprAttr:true},
      },
      method: { 
        desc: '请求方法',
        type: 3,
        select: {
          'post':'post', 'get':'get', 'head':'head', 'delete':'delete',
          'jsonp':'jsonp', 'put':'put', 'patch':'patch',
        },
        def: 'post',
      },
      timeout: {
        desc: '超时, 毫秒',
        type: 2,
        def: 5000,
        propsConfig: {isExprAttr:true},
      },
      urlencoded: {
        desc: '转换为 URL 参数',
        type: 3,
        select: {
          '转换': true, '维持原样': false,
        },
        def: true,
        propsConfig: {isExprAttr:true},
      },
      rtype: {
        desc: '返回数据类型',
        type: 3,
        select: {
          '文本': 'text', "JSON对象": 'json', "二进制": 'blob',
        },
        def: 'json',
      },
      headers: {
        desc: '请求头域',
        type: 1,
        canDynamic: true,
      },
      'update.sync': {
        desc: '绑定更新方法到变量',
        type: 1,
        canDynamic: true,
        propsConfig: {isExprAttr:true},
      },
      'v-model': {
        desc: '绑定返回数据到变量',
        type: 1,
        canDynamic: true,
        propsConfig: {isExprAttr:true},
      },
      success: {
        desc: '接口成功返回 回调函数',
        type: 8,
        propsConfig: {type:'event'},
      },
      error: {
        desc: '接口失败返回 回调函数',
        type: 8,
        propsConfig: {type:'event'},
      },
    },
  },
}