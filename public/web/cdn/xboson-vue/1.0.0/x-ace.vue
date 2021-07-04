<!-- Create By xBoson System -->

<template>
  <textarea ref='textarea'></textarea>
</template>

<script>
const aceVer = '1.4.12';
const ace = require("cdn/ace/"+ aceVer +"/ace.js");
ace.config.set('basePath', xv.cdn_path +'ace/'+ aceVer +'/');

//
// 参数:
//  value - v-module 绑定
//  language - 可以用 'javascript' 等, 默认 text
//  theme - 风格
//
// 事件:
//  input - v-module 绑定
//  editHandle - Function(fn) 在组件初始化完成发出该事件, 
//        参数是一个函数:Function(editorObject), 用来向编辑器光标位置插入字符串
//
export default {
  props: ['value', 'language', 'theme'],
  
  data() {
    return {
      tid: 0,
      editor: null,
      selfChange : false,
      changeDelay : 300,
    };
  },
  
  watch: {
    value(v) {
      if (this.selfChange) {
        this.selfChange = false;
        return;
      }
      let pos = this.editor.getCursorPosition();
      this.editor.setValue(v);
      this.editor.moveCursorToPosition(pos);
    }
  },
  
  mounted() {
    this.initEditor();
    this.$emit('editHandle', this.editor);
  },
  
  destroyed() {
    this.editor.destroy();
  },
  
  methods: {
    change() {
      this.selfChange = true;
      this.$emit("input", this.editor.getValue());
    },
    
    initEditor() {
      let dom = this.$refs.textarea;
      let editor = ace.edit(dom);
      if (this.theme) {
        editor.setTheme("ace/theme/"+ this.theme);
      }
      if (this.language) {
        editor.session.setMode("ace/mode/"+ this.language);
      }
      
      editor.on("change", e=>{
        // 延迟
        if (this.tid) {
          clearTimeout(this.tid);
        }
        this.tid = setTimeout(()=>{
          this.tid = 0;
          this.change();
        }, this.changeDelay);
      });
      
      editor.setValue(this.value, this.value.length);
      editor.setStyle('x-ace-editor');
      this.editor = editor;
    },
  },
}
</script>

<style>
.x-ace-editor {
  height: 100%;
}
</style>