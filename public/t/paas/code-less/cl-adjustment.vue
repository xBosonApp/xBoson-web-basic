<!-- Create By xBoson System -->

<template>
  <a-tabs type="card">
    
    <a-tab-pane key="1" tab="属性" class='panel'>
      <div v-if='config != null'>
        <div>文本</div>
        <a-textarea v-model='config.txt'
          placeholder="组件显示文本"
          :auto-size="{ minRows: 2, maxRows: 10 }"/>
          
        <div v-for='(p, name) in getComponentProps()'>
          <div>{{p.desc}}</div>
          <component :is='getComponentName(p.type)' v-bind='getOption(name)' 
              v-model='config.props[name]'/>
        </div>
      </div>
    </a-tab-pane>
    
    <a-tab-pane key="2" tab="样式" class='panel'>
      <div v-if='config != null'>
        <cl-style-adj :styleVal='config.props.style'></cl-style-adj>
      </div>
    </a-tab-pane>
    
    <a-tab-pane key="3" tab="高级" class='panel'>
    </a-tab-pane>
    
    <a-tab-pane key="4" tab="接口" class='panel'>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
const clib = require("./component-library.js");
const compMap = {
  1:'a-input',
  2:'a-input-number',
  3:'a-select',
  4:'a-input',
  5:'a-input',
  6:'cl-icon-select',
};

export default {
  components: {
    'cl-icon-select' : require("./cl-icon-select.vue", 1, 1),
    'cl-style-adj'   : require("./cl-style-adj.vue", 1, 1),
  },
  
  computed: {
    config() {
      return this.$store.state.currentAdjustmentComponentConfig;
    },
  },
  
  methods : {
    getComponentName(i) {
      return compMap[i];
    },
    
    getComponentProps() {
      return this.getComponent().props;
    },
    
    getComponent() {
      return clib.getComponent(this.config.id);
    },
    
    _getSelectOpt(select) {
      let options = [];
      for (let label in select) {
        options.push({
          label,
          value : select[label],
        });
      }
      return options;
    },
    
    getOption(name) {
      let p = this.getComponent().props[name];
      // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 5:来自变量, 6:图标选择
      switch (p.type) {
        case 1:
          return { maxLength: p.max };
        case 2:
          return { min: p.min, max: p.max, };
        case 3:
          let options = this._getSelectOpt(p.select);
          return { 'default-value': p.def, options, style: 'width: 100%' };
        case 4:
          return {};
        case 5:
          return {};
        case 6:
          return { style: 'width: 100%' };
        default:
          throw new Error("无效的值类型"+ p.type);
      }
    },
  }
}
</script>

<style scoped>
.panel {
  padding: 2px 5px;
}
</style>