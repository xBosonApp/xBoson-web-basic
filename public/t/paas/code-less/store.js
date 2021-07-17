/* Create By xBoson System */

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
    bindContextStyle : {},
    // { id: boolean }
    // isComponentLoaded : {},
    componentLoadState : {},
    
    // 方便调试的开关
    test : true,
    testOpenFile : 'HoL5yZAFT7ao6XRuvbPFwQ',
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