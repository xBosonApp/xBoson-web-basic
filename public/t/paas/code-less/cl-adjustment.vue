<!-- Create By xBoson System -->

<template>
  <a-tabs type="card">
    
    <a-tab-pane key="1" tab="属性" class='panel'>
      <div v-if='config != null'>
        <div>ID</div>
        <a-input :value='config.id' disabled='true' />
        
        <div v-if='!config.removeTxt'>文本</div>
        <a-textarea 
          v-model='config.txt'
          placeholder="组件显示文本"
          v-if='!config.removeTxt'
          :auto-size="{ minRows: 2, maxRows: 10 }"/>
          
        <div>备注</div>
        <a-textarea 
          v-model='config.note'
          placeholder="备注"
          :auto-size="{ minRows: 1, maxRows: 10 }"/>
          
        <a-popover title="确认删除?" trigger="click">
          <a-button type="danger" slot="content" @click="removeComponent">立即删除选中组件!</a-button>
          <a-button type='dashed' size='small' block class='space'>删除组件</a-button>
        </a-popover>
        
        <space/>  
        
        <div v-for='(p, name) in getComponentProps()'>
          <div>{{p.desc}}</div>
          <component :is='getComponentName(p)' v-bind='getOption(name)' 
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
  data() {
    return {
    }  
  },
  
  computed: {
    config() {
      return this.$store.state.currentAdjustmentComponentConfig;
    },
  },
  
  methods : {
    getComponentName(p) {
      if (p.type == 7) {
        if (!p.component) throw new Error("component attribute null");
        return p.component;
      }
      return compMap[p.type];
    },
    
    getComponentProps() {
      return this.getComponent().props;
    },
    
    getComponent() {
      return clib.getComponent(this.config.cid);
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
    
    // 返回的所有属性绑定到创建的组件上, 来自组件定义数据
    getOption(name) {
      let p = this.getComponent().props[name];
      // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 
      // 5:来自变量, 6:图标选择, 7:自定义插件
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
        case 7:
          return p.props || {};
        default:
          throw new Error("无效的值类型"+ p.type);
      }
    },
    
    removeComponent() {
      this.$store.commit('removeNestedItem');
    },
  }
}
</script>

<style scoped>
.panel {
  padding: 2px 5px;
}
.space {
  margin: 2px 0;
}
space {
  height: 1em; width: 100%; display: block;
}
</style>