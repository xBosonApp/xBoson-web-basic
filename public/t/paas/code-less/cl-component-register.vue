<!-- Create By xBoson System -->

<template>
<div>
  <a-steps :current="currentState.step" size='small'>
    <a-step v-for="(s, i) in currentState.stepInf" 
      :key="i" 
      :title="s.title"
      :description='s.desc' />
    <a-step key='wait' title='选择下一步操作' />
  </a-steps>
  <a-alert 
    v-if='message' type="error" 
    banner style='margin: 10px 2px;'>
    <pre slot='message'>{{ message }}</pre>
  </a-alert>
  
  <component 
    :is='processConfig.component' 
    :data='currentState.data'
    :next='nextStep'
    @change='setStage'/>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  computed: {
    processConfig() {
      // let p = this.processes[this.currentState.process];
      return this.currentState.stepInf[this.currentState.step] || {};
    },
  },
  
  data() {
    return {
      currentState : { process: 'default', step: 0, data:{}, stepInf: [] },
      message : null,
      
      processes : {
        'default': [
          { title: '组件库列表', component: 'cl-reg-clib-list' },
        ],
        
        createCLib : [
          { title: '创建组件库', component: 'cl-reg-clib-create' },
        ],
        
        editCLib : [
          { title: '编辑组件库', component: 'cl-reg-clib-create' },
        ],
        
        crtbind : [
          { title: '绑定组件', component: 'cl-reg-bind-create' },
        ],
        
        delbind : [
          { title: '删除绑定组件', component: 'cl-reg-bind-del' },
        ],
      },
    };
  },
  
  created() {
    this.defineComponentFromData();
  },
  
  mounted() {
    this.returnDefault();
  },
  
  methods: {
    setStage(name, data) {
      if (!this.processes[name]) {
        throw new Error("无效的流程 "+ name);
      }
      this.currentState.process = name;
      this.currentState.data = data || {};
      
      if (name == 'default') {
        this.currentState.step = 0;
        this.currentState.stepInf.splice(0);
      } else {
        this.currentState.step++;
      }
      
      this.processes[name].forEach(p=>{
        this.currentState.stepInf.push(p);  
      });
      
    },
    
    defineComponentFromData() {
      for (let n in this.processes) {
        let p = this.processes[n];
        for (let i=0; i<p.length; ++i) {
          let name = p[i].component;
          this.$options.components[name] = tool.requirec(name);
        }
      }
    },
    
    returnDefault() {
      this.setStage('default');
    },
    
    nextStep(err, ret) {
      if (err) {
        this.message = err.message;
        return;
      } else {
        this.message = null;
        antd.message.success(ret.msg);
      }
      
      if (this.currentState.step+1 < this.currentState.stepInf.length) {
        this.currentState.step++;
        this.currentState.data.ret = ret;
        return true;
      }
      // 重新回到最初的画面?
      this.returnDefault();
      return false;
    },
  },
}
</script>

<style scoped>
</style>