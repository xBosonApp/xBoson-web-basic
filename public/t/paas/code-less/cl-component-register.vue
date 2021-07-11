<!-- Create By xBoson System -->

<template>
<div>
  <a-steps :current="currentState.step" size='small' style='margin-bottom: 20px;'>
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
    @previous='previousStep'
    @change='setStage'
    @clear='message = null'/>
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
      currentState : { 
        process: 'default', 
        step: 0, 
        data: {
          clib : null, // 当前选中的组件库
          ret  : null, // 页面切换返回值
          bind : null, // 绑定组件对象
        }, 
        stepInf: [] 
      },
      
      message : null,
      
      processes : {
        'default': [
          { title: '组件库列表', component: 'cl-reg-clib-list' },
        ],
        
        createCLib : [
          { title: '创建组件库', component: 'cl-reg-clib-create' },
        ],
        
        editCLib : [
          { title: '编辑组件库', desc:'组件库基础信息', component: 'cl-reg-clib-create' },
        ],
        
        openClib : [
          { title: '组件库设定', desc:'组件库中的组件列表', component: 'cl-reg-bind-list' },
        ],
        
        createBind : [
          { title: '绑定组件', desc:'为组件库绑定组件', component: 'cl-reg-bind-create' },
          { title: '组件属性', desc:'绑定组件的属性定义', component: 'cl-reg-bind-prop' },
        ],
        
        editProps : [
          { title: '组件属性', desc:'绑定组件的属性定义', component: 'cl-reg-bind-prop' },
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
    // onChange(name, merginData)
    setStage(name, data) {
      this.message = null;
      if (!this.processes[name]) {
        throw new Error("无效的流程 "+ name);
      }
      this.currentState.process = name;
      
      if (name == 'default') {
        this.currentState.step = 0;
        this.currentState.stepInf.splice(0);
        this.currentState.data = data || {};
      } else {
        this.currentState.step++;
        this.shallowCopy(this.currentState.data, data);
      }
      
      this.processes[name].forEach(p=>{
        this.currentState.stepInf.push(p);  
      });
    },
    
    shallowCopy(tar, src) {
      for (let n in src) {
        tar[n] = src[n];
      }
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
    
    previousStep(ret) {
      this.message = null;
      if (this.currentState.step-1 >= 0) {
        this.currentState.stepInf.splice(this.currentState.step);
        this.currentState.step--;
        this.currentState.data.ret = ret;
      } else {
        this.returnDefault();  
      }
    },
  },
}
</script>

<style scoped>
</style>