/* Create By xBoson System */
const KEY_PREFIX = "code_less$store$";

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


module.exports = new Vuex.Store({
  state: {
    showDropTip: true,
    message: '',
    currentAdjustmentComponentConfig: null,
    nestedItemRef: null,
    project: null,
    editFile: null,
    // 必须对css属性进行逐项复制
    cssClipboard: null, 
    // 存储 json 字符串
    menuClipboard: null,
    bindContextStyle : {},
    // { id: boolean }
    // isComponentLoaded : {},
    componentLoadState : {},
    // 默认页面配置
    defaultPageSetting : loads('defaultPageSetting'),
    
    // 方便调试的开关
    test : true,
    testOpenFile : 'FGNWoFDNSByeThW_k2sxmQ',
  },
  
  mutations: {
    closeDropTip(state) {
      state.showDropTip = false;
    },
    
    setAdjustmentComponent(s, cfg) {
      s.currentAdjustmentComponentConfig = cfg;
    },
    
    clearAdjComponent(s) {
      s.currentAdjustmentComponentConfig = null;
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
    
    // parm[clid, cb:Function(error)]
    loadComponentsFromLibrary(s, parm) {
      let clid = Array.isArray(parm) ? parm[0] : parm;
      let cb   = Array.isArray(parm) ? parm[1] : null;
      
      if (!s.componentLoadState[clid]) {
        s.componentLoadState[clid] = new Promise((ok, fail)=>{
          this.commit('forceLoadComponentsFromLibrary', [clid, err=>{
            if (err) fail(err);
            else ok();
          }]);
        }).then(cb, cb);
      } else {
        s.componentLoadState[clid].then(cb, cb);
      }
    },
    
    // parm[clid, cb:Function(error)]
    forceLoadComponentsFromLibrary(s, parm) {
      let clid = Array.isArray(parm) ? parm[0] : parm;
      let cb   = Array.isArray(parm) ? parm[1] : null;
      let lib  = require("./component-library.js");
      
      lib.loadComponent(clid).catch(err=>{
        xv.popError('组件加载失败', err);
        cb && cb(err);
      }).then(()=>{
        cb && cb(null);
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