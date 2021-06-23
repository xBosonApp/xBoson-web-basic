<!-- Create By xBoson System -->

<template>
  <div class="card-container">
    <a-tabs @change='changeFile' :activeKey='getActiveKey()'>
      <a-tab-pane v-for='(f, k) in this.editorFiles' :key="k" :tab="getName(f)">
        <cl-page-design :file='f'/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  props: ['editorFiles'],
  
  data() {
    return {
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
    },
  },
}
</script>

<style>
</style>