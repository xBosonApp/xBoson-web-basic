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
    
    // 方便调试的开关
    test : true,
    testOpenFile : 'OkYEBLniTHOzCsM_cMYQFA',
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