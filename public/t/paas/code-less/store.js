/* Create By xBoson System */
const KEY_PREFIX = "code_less$store$";

const DefaultPageSetting = {
  index: {},
  hasBorder: false,
  resolution: { w:'auto', h:'auto' },
};


module.exports = new Vuex.Store({
  state: {
    showDropTip: true,
    message: '',
    currentAdjustmentComponentConfig: null,
    currentAdjustmentComponentExt: null,
    nestedItemRef: null,
    project: null,
    editFile: null,
    // 必须对css属性进行逐项复制
    cssClipboard: null, 
    // 存储 json 字符串
    menuClipboard: null,
    // 单个组件的全部属性
    propsClipboard: null,
    bindContextStyle : {},
    // { id: boolean }
    // isComponentLoaded : {},
    componentLoadState : {},
    // 默认页面配置
    defaultPageSetting : loads('defaultPageSetting') || DefaultPageSetting,
    
    // 方便调试的开关
    test : true,
    testOpenFile : 'Y0bziUtESjGCHOu_hmtebA',
  },
  
  mutations: {
    closeDropTip(state) {
      state.showDropTip = false;
    },
    
    setAdjustmentComponentExt(s, ext) {
      s.currentAdjustmentComponentExt = ext;
    },
    
    setAdjustmentComponent(s, cfg) {
      s.currentAdjustmentComponentConfig = cfg;
    },
    
    clearAdjComponent(s) {
      s.currentAdjustmentComponentConfig = null;
      s.currentAdjustmentComponentExt = null;
    },
    
    setEditFile(s, f) {
      s.editFile = f;
      this.commit('clearAdjComponent');
    },
    
    setEditFileChanged(s, changed) {
      if (s.editFile) {
        s.editFile.changed = changed;
      }
    },
    
    setEditFilePageSetting(s, ps) {
      if (s.editFile) {
        s.editFile.content.root.pageSetting = ps; 
        this.commit('setEditFileChanged', true);
      }
    },
    
    setDefaultPageSetting(s, ps) {
      s.defaultPageSetting = ps || null;
      saves('defaultPageSetting', ps);
    },
    
    setMessage(s, msg) {
      s.message = msg;
    },
    
    setNestedItemRef(s, d) {
      s.nestedItemRef = d;
    },
    
    removeNestedItem(s) {
      if (s.nestedItemRef) {
        s.nestedItemRef.list.splice(s.nestedItemRef.index, 1);
        s.nestedItemRef = null;
        this.commit('clearAdjComponent');
      }
    },
    
    setProject(s, p) {
      s.project = p;
    },
    
    setCssClipboard(s, data) {
      s.cssClipboard = data;
    },
    
    setMenuClipboard(s, data) {
      s.menuClipboard = data ? JSON.stringify(data) : null;
    },
    
    setComponentPropsClipboard(s, data) {
      s.propsClipboard = data;
    },
    
    setBindContextStyle(s, styledom) {
      if (!s.editFile) {
        throw new Error("not file edit context");
      }
      s.bindContextStyle[s.editFile._id] = styledom;
    },
    
    clearBindContextStyle(s, fid) {
      delete s.bindContextStyle[fid];
    },
    
    theComponentChanged(s, clid) {
      s.componentLoadState[clid] = null;
    },
    
    // parm[ clid, ok:Function(state), fail:Function(err) ]
    loadComponentsFromLibrary(s, parm) {
      let clid = Array.isArray(parm) ? parm[0] : parm;
      let ok   = Array.isArray(parm) ? parm[1] : null;
      let fail = Array.isArray(parm) ? parm[2] : null;
      
      let state;
      let p = s.componentLoadState[clid];
      if (!p) {
        state = 'load';
        p = s.componentLoadState[clid] = new Promise((ok, fail)=>{
          this.commit('forceLoadComponentsFromLibrary', [clid, ok, fail]);
        });
      } else {
        state = 'cache';
      }
      
      ok   && p.then(()=>ok(state));
      fail && p.catch(fail);
    },
    
    // parm[ clid, ok:Function(), fail:Function(err) ]
    forceLoadComponentsFromLibrary(s, parm) {
      let clid = Array.isArray(parm) ? parm[0] : parm;
      let ok   = Array.isArray(parm) ? parm[1] : null;
      let fail = Array.isArray(parm) ? parm[2] : null;
      let lib  = require("./component-library.js");
      
      lib.loadComponent(clid).catch(err=>{
        xv.popError('组件加载失败', err);
        fail(err);
      }).then(()=>{
        ok();
      });
    },
  },
  
  getters: {
    contextStyle(s) {
      if (!s.editFile) {
        throw new Error("not file edit context");
      }
      return s.bindContextStyle[s.editFile._id];
    },
  },
});


function loads(name, _throw_error) {
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFIX + name));
  } catch(e) {
    if (_throw_error) throw e;
  }
}


function saves(name, v) {
  localStorage.setItem(KEY_PREFIX + name, JSON.stringify(v));
}