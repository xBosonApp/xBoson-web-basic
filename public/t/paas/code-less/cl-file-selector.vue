<!-- Create By xBoson System -->

<template>
  <a-tree-select
    :value='value'
    :tree-data="dirData"
    :placeholder="placeholder"
    :load-data="onLoadDirData"
    @change='onChange'
  />
</template>

<script>
const tool = require("./tool.js");

export default {
  props: {
    placeholder: String,
    value: Object,
    rootTitle: String,
    
    fileCanSelect: {
      type: Boolean,
      default: true,
    },
    dirCanSelect: {
      type: Boolean,
      default: true,
    },
  },
  
  data() {
    let title = this.rootTitle || this.$store.state.project.name;
    return {
      dirData:[
        { title, key:'/', readOnly: true, isDir: true, selectable: false, },
      ],
    };
  },
  
  methods: {
    onChange(v) {
      this.$emit('input', v);
    },
    
    dir(parentid, cb) {
      tool.api('file', 'dir', { parentid }, (err, ret)=>{
        if (err) return cb(err);
        
        ret.data.forEach((d)=>{
          d.title = d.name;
          d.key = d._id;
          d.value = d._id;
          
          if (d.isDir) {
            d.selectable = this.dirCanSelect;
            d.disabled = !this.dirCanSelect;
          } else {
            d.isLeaf = true;
            d.selectable = this.fileCanSelect;
            d.disabled = !this.fileCanSelect;
          }
        });
        
        cb(null, ret.data);
      });
    },
    
    onLoadDirData(n) {
      return new Promise((resolve,reject) => {
        this.dir(n.dataRef.key, (err, data)=>{
          if (err) return reject(err);
          
          n.dataRef.children = data.sort(tool.filesort);
          this.dirData.sort();
          resolve();
        });
      });
    },
  },
}
</script>

<style scoped>
</style>