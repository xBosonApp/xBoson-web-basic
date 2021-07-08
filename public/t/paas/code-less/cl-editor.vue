<!-- Create By xBoson System -->

<template>
  <div class="card-container">
    <a-tabs @change='changeFile' :activeKey='getActiveKey()'>
      <a-tab-pane v-for='(f, k) in this.editorFiles' :key="k" :tab="getName(f)">
        <cl-page-design :file='f'/>
      </a-tab-pane>
    </a-tabs>
    <center v-if='noOpendFile' class='tip animate__animated animate__jello'>
      请 <span>打开</span> 或 <span>新建</span> 一个文件.
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
  font-size: 12px; color: #ccc; padding: 170px 0;
}
.tip span {
  font-size: 15px; color: #999; display: inline-block; margin: 0 3px;
}
.card-container {
  background-color: #fff;
}
</style>