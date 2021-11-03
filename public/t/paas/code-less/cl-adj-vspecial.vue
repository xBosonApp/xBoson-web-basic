<!-- Create By xBoson System -->

<template>
<div>
  <div v-for='c in vs' v-if='config.vspecial[c.attr]' class='spt'>
    <div>{{ c.title }}</div>
    <cl-attr-bind-data
      v-model='config.vspecial[c.attr].value'
      :config='config.vspecial[c.attr].propsConfig'
      @change='fileChanged'
    />
  </div>
  
  <div v-if='vSlot' class='spt'>
    <div class='items-group sl'>
      <div>插槽</div>
      <a-switch v-model='vSlot.propsConfig.isExprAttr' size="small" class='to'>
        <span slot="checkedChildren">绑定到插槽</span>
        <span slot="unCheckedChildren">无</span>
      </a-switch>
    </div>
    
    <a-input-group compact>
      <a-input class='hf' 
        placeholder='插槽名' 
        v-model='vSlot.propsConfig.ref'
        :disabled='!vSlot.propsConfig.isExprAttr'/>
        
      <a-input class='hf' 
        placeholder='接收参数表达式' 
        v-model='vSlot.value'
        :disabled='!vSlot.propsConfig.isExprAttr'/>
    </a-input-group>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['config'],
  components : tool.loadc('cl-attr-bind-data'),
  
  data() {
    return {
      vs:[
        { title:'渲染条件表达式', attr:'v-if' },
        { title:'循环表达式', attr:'v-for'},
        { title:'组件实例唯一 Key', attr:'key' },
        { title:'DOM 引用', attr:'ref' },
      ],
      
      vSlot: this.config.vspecial["v-slot"],
    };
  },
}
</script>

<style scoped>
.hf { width: 50%!important; }
.sl { grid-template-columns: 1fr auto; }
.to { margin-top: 3px; }
.spt { margin-top: 5px; }
</style>