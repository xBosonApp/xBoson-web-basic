<!-- Create By xBoson System -->

<template>
  <div class='root'>
    <a class='title' href='http://xboson.net' target='_blank'>xBoson 低代码开发平台</a>
    <span class='note'>{{projectName}}</span>
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        文件 <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="3" :disabled='!hasFile' @click='saveFile'>
          保存 <span class='note'>ctrl+s</span>
        </a-menu-item>
        <a-menu-item key='4' :disabled='!hasFile' @click='closeFile'>
          关闭 <span class='note'>ctrl+w</span>
        </a-menu-item>
        
        <a-menu-divider />
        <a-menu-item key="0" @click='createComponent'>
          新建 <span class='note'>ctrl+n</span>
        </a-menu-item>
        <a-menu-item key="1" @click='openComponent'>
          打开 <span class='note'>ctrl+o</span>
        </a-menu-item>
        <a-menu-item key="2" @click='managerComponent'>
          文件管理 <span class='note'>ctrl+m</span>
        </a-menu-item>
        
        <a-menu-divider />
        <a-menu-item key="3" @click='quit'>
          退出 <span class='note'>ctrl+q</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        选项 <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="0" @click='preview'>
          预览 <span class='note'>ctrl+x</span>
        </a-menu-item>
        
        <a-menu-divider />
        <a-menu-item key="1">
          页面设置
        </a-menu-item>
        <a-menu-item key="3">
          组件注册表
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    
    <a-drawer
      title="打开文件"
      placement="top"
      height='calc(100% - 80px)'
      destroyOnClose='true'
      :closable="true"
      :visible="showOpen"
      @close="showOpen = false">
      <cl-open-file @close='showOpen = false' @open-file='openFile'/>
    </a-drawer>
    
    <a-drawer
      title="新建文件"
      placement="top"
      height='calc(100% - 80px)'
      :closable="true"
      :visible="showCreate"
      destroyOnClose='true'
      @close="showCreate = false">
      <cl-create-file @close='showCreate = false' @open-file='openFile'/>
    </a-drawer>
    
    <a-drawer
      title="文件管理"
      placement="top"
      height='calc(100% - 80px)'
      destroyOnClose='true'
      :closable="true"
      :visible="showMgr"
      @close="showMgr = false">
      <cl-file-manager :pre-delete='preDelete' @changeName='changeName'/>
    </a-drawer>
    
    <a-modal
      title="文件没有保存, 是否立即关闭?"
      :visible="showDelete"
      okText='关闭文件丢失修改'
      okType='danger'
      cancelText='取消关闭'
      @ok="doClose"
      @cancel="showDelete = false">
        <div>{{deleteContent}}</div>
    </a-modal>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['projectName', 'editorFiles'],
  
  data() {
    return {
      showCreate : false,
      showOpen : false,
      showMgr : false,
      showDelete : false,
      deleteContent : '',
      keyMap : {},
    };
  },
  
  computed: {
    hasFile() {
      return this.getEditFile() != null;
    },
  },
  
  mounted() {
    document.addEventListener('keydown', this.onKeydown);
    this.monitorKey('s', this.saveFile, true);
    this.monitorKey('w', this.closeFile, true);
    this.monitorKey('q', this.quit);
    this.monitorKey('x', this.preview, true);
    this.monitorKey('o', this.openComponent);
    this.monitorKey('n', this.createComponent);
    this.monitorKey('m', this.managerComponent);
  },
  
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown);
  },
  
  methods: {
    createComponent() {
      this.showCreate = true;
    },
    openComponent() {
      this.showOpen = true;
    },
    managerComponent() {
      this.showMgr = true;
    },
    
    quit() {
      for (let id in this.editorFiles) {
        if (this.editorFiles[id].changed) {
          this.$notification.warning({
            message: '退出',
            description: '有文件尚未保存: '+ this.editorFiles[id].name,
          });
          return;
        }
        this.$delete(this.editorFiles, id);
      }
      this.$store.commit('clearAdjComponent');
      this.$emit('quit');
    },
    
    saveFile() {
      let file = this.getEditFile();
      let parm = {
        _id : file._id,
        content : JSON.stringify(file.content),
      };
      
      tool.api('file', 'save', parm, (err, ret)=>{
        if (err) return xv.popError('错误', err);
        
        file.changed = false;
        this.$notification.success({
          message: ret.msg,
          description: file.name,
        });
      });
    },
    
    closeFile() {
      let file = this.getEditFile();
      if (file.changed) {
        this.deleteContent = "文件:"+ file.name;
        this.showDelete = true;
      } else {
        this.doClose();
      }
    },
    
    doClose() {
      let file = this.getEditFile();
      this.$delete(this.editorFiles, file._id);
      this.$store.commit('clearAdjComponent');
      this.showDelete = false;
    },
    
    getEditFile() {
      return this.$store.state.editFile;
    },
    
    openFile(fileid) {
      if (this.editorFiles[fileid]) {
        this.$notification.open({
          message: '打开文件',
          description: '文件已经在编辑器中打开',
        });
        this.focusFile(fileid);
        return;
      }
      
      tool.api('file', 'load', {_id:fileid}, (err, ret)=>{
        if (err) return xv.popError('错误', err);
        let file = ret.data;
        file.changed = false;
        file.content = JSON.parse(file.content);
        this.$set(this.editorFiles, file._id, file);
        this.focusFile(fileid);
      });
    },
    
    focusFile(fileid) {
      this.$store.commit('setEditFile', this.editorFiles[fileid]);
    },
    
    preview() {
      console.log('Preview');
    },
    
    changeName(fileinfo) {
      let fd = this.getEditFile(fileinfo._id);
      if (fd) {
        fd.name = fileinfo.name;
      }
    },
    
    preDelete(fileid) {
      if (this.editorFiles[fileid]) {
        return "不能删除正在编辑的文件";
      }
      return;
    },
    
    monitorKey(key, fn, needOpenedFile) {
      this.keyMap[key.toLowerCase()] = {
        fn, needOpenedFile,
      };
    },
    
    onKeydown(e) {
      if (!e.ctrlKey) return;
      // console.log(e.code, e.keyCode, e.key)
      let cfg = this.keyMap[e.key.toLowerCase()];
      if (!cfg) return;
      if (cfg.needOpenedFile && (!this.hasFile)) return;
      cfg.fn();
      return false;
    },
  },
}
</script>

<style scoped>
.root {
  padding-left: 20px;
}
.title {
  float: right; color: #ccc; padding-right: 20px;
}
.ant-dropdown-link {
  padding-left: 20px;
}
.ant-dropdown-menu-item {
  min-width: 220px;
}
.ant-dropdown-menu-item .note {
  float: right; font-family: Monospace;
}
</style>