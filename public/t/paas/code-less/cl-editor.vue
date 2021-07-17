<!-- Create By xBoson System -->

<template>
  <div class="card-container">
    <a-tabs @change='changeFile' :activeKey='getActiveKey()'>
      <a-tab-pane v-for='(f, k) in this.editorFiles' :key="k" :tab="getName(f)">
        <cl-page-design :file='f'/>
      </a-tab-pane>
    </a-tabs>
    <center v-if='noOpendFile' class='tip animate__animated animate__jello'>
      <ol class='tipcontent'>
        <li>在必要时用 <span>文件管理</span> 创建(模块)目录.</li>
        <li><span>新建</span> 或 <span>打开</span> 一个文件(页面)进行编辑.</li>
        <li>在必要时用 <span>应用管理</span> 创建新应用.</li>
        <li>在 <span>应用管理</span> 中将做好的文件(页面)绑定到应用的菜单.</li>
      </ol>
    </center>
  </div>
</template>

<script>
export default {
  props: ['editorFiles'],
  
  data() {
    return {
    }
  },
  
  computed: {
    noOpendFile() {
      return this.$store.state.editFile == null;
    }
  },
  
  methods: {
    getActiveKey() {
      let f = this.$store.state.editFile;
      return f && f._id;
    },
    
    getName(f) {
      if (f.changed) {
        return f.name +' *';
      }
      return f.name;
    },
    
    changeFile(key) {
      this.$store.commit('setEditFile', this.editorFiles[key]);
      this.changeMountdContextStyle(key);
    },
    
    changeMountdContextStyle(key) {
      const bcsa = this.$store.state.bindContextStyle;
      for (let id in bcsa) {
        if (key == id) {
          bcsa[id].mount();
        } else {
          bcsa[id].unmount();
        }
      }
    }
  },
}
</script>

<style scoped>
.tip {
  font-size: 12px; color: #ccc; padding: 120px 0;
}
.tip span {
  font-size: 15px; color: #999; display: inline-block; margin: 0 3px;
}
.card-container {
  background-color: #fff;
}
.tipcontent {
  display: inline-block; text-align: left;
}
</style>