<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>InputNumber 计数器</h2>
    <p>仅允许输入标准的数字值，可定义范围</p>
    <demo-layout>
      <div v-pre>
<el-input-number 
  v-model="i" 
  :min="1" 
  :max="10" 
  label="描述文字"></el-input-number>
      </div>
    </demo-layout>
    
    <h3>禁用状态</h3>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i" :disabled="true"></el-input-number>
      </div>
    </demo-layout>
    
    <h3>步数</h3>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i" :step="2"></el-input-number>
      </div>
    </demo-layout>
    
    <h3>严格步数</h3>
    <p>step-strictly属性接受一个Boolean。如果这个属性被设置为true，则只能输入步数的倍数。</p>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i" :step="2" step-strictly></el-input-number>
      </div>
    </demo-layout>
    
    <h3>精度</h3>
    <p>precision 的值必须是一个非负整数，并且不能小于 step 的小数位数。</p>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i" :precision="2" :step="0.1" :max="10"></el-input-number>
      </div>
    </demo-layout>
    
    <h3>尺寸</h3>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i"></el-input-number>
<el-input-number size="medium" v-model="i"></el-input-number>
<el-input-number size="small" v-model="i"></el-input-number>
<el-input-number size="mini" v-model="i"></el-input-number>
      </div>
    </demo-layout>
    
    <h3>按钮位置</h3>
    <demo-layout>
      <div v-pre>
<el-input-number v-model="i" controls-position="right" :min="1" :max="10">
</el-input-number>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
export default {
}
</script>

<style>
</style>