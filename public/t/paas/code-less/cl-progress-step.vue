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
  
  <transition
    :enter-class='enterClass'
    :enter-to-class='enterClass'
    :leave-to-class='leaveClass'
  >
    <component 
      class='anim'
      :is='processConfig.component' 
      :data='currentState.data'
      :next='nextStep'
      @previous='previousStep'
      @change='setStage'
      @clear='message = null'/>
  </transition>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: {
    // 进程数据, 默认进程 'default'
    processes : Object,
    // 切换进程时使用的数据结构
    value : Object,
  },
  
  computed: {
    processConfig() {
      // let p = this.processes[this.currentState.process];
      return this.currentState.stepInf[this.currentState.step] || {};
    },
    
    enterClass() {
      if (this.directReverse) return 'animate__animated animate__fadeInLeft';
      return 'animate__animated animate__fadeInRight';
    },
    
    leaveClass() {
      if (this.directReverse) return 'animate__animated animate__fadeOutRight';
      return 'animate__animated animate__fadeOutLeft';
    },
  },
  
  watch: {
    'currentState.step': function(n, o) {
      this.directReverse = n < o;
    },
  },
  
  data() {
    return {
      currentState : { 
        process: 'default', 
        step: 0, 
        data: this.value,
        stepInf: [] 
      },
      
      directReverse: false,
      message : null,
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
    
    // next(error, retData, merginData)
    nextStep(err, ret, margin) {
      if (err) {
        this.message = err.message;
        console.error(err);
        return;
      } else {
        this.message = null;
        antd.message.success(ret.msg);
      }
      
      if (this.currentState.step+1 < this.currentState.stepInf.length) {
        this.currentState.step++;
        this.currentState.data.ret = ret;
        if (margin) {
          this.shallowCopy(this.currentState.data, margin);
        }
        return true;
      }
      
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
.anim { --animate-duration: 0.5s; position: absolute; width: 100%;
}
</style>