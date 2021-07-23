<!-- Create By xBoson System -->

<template>
  <a-tree-select
    :value='value'
    :tree-data="dirData"
    :placeholder="placeholder"
    :load-data="onLoadDirData"
    :allowClear='allowClear'
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
    allowClear: {
      type: Boolean,
      default: false,
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
  
  watch: {
    value(v) {
      this.file(v);
    },
  },
  
  mounted() {
    this.file(this.value);
  },
  
  methods: {
    onChange(v) {
      this.$emit('input', v || '');
    },
    
    dir(parentid, cb) {
      tool.api('file', 'dir', { parentid }, (err, ret)=>{
        if (err) return cb(err);

        this.conversion(ret.data);
        cb(null, ret.data);
      });
    },
    
    file(_id) {
      if (_id && (typeof _id == 'string')) {
        if (this.dirData.find(d=>d._id == _id)) {
          return;
        }
      } else {
        return;
      }
      
      tool.api('file', 'dir', {_id}, (err, ret)=>{
        if (err) return xv.popError('文件信息', err);
        this.conversion(ret.data);
        //TODO: 隐藏这些临时补位项
        ret.data[0].disabled = true; 
        this.dirData.push(ret.data[0]);
      });
    },
    
    conversion(arr) {
      arr.forEach((d)=>{
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
      return arr;
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