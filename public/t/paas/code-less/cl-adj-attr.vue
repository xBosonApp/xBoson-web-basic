<!-- Create By xBoson System -->

<template>
  <div>
    <div>ID</div>
    <a-input :value='config.id' disabled='true' />
    
    <div v-if='!config.removeTxt'>文本</div>
    <a-textarea 
      v-model='config.txt'
      placeholder="组件显示文本"
      v-if='!config.removeTxt'
      @change='fileChanged'
      :auto-size="{ minRows: 2, maxRows: 10 }"/>
      
    <div>备注</div>
    <a-textarea 
      v-model='config.note'
      placeholder="备注"
      @change='fileChanged'
      :auto-size="{ minRows: 1, maxRows: 10 }"/>
      
    <a-popconfirm
      title="立即删除选中组件?"
      ok-text="删除!"
      ok-type='danger'
      cancel-text="取消"
      @confirm="removeComponent">
        <a-button type='primary' size='small' block class='space'>删除组件</a-button>
    </a-popconfirm>
    
    <space/>
    
    <div v-for='(p, name) in getComponentProps()'>
      <component :is="getGasketName(p, name)"
        :name='name'
        :desc='p.desc'
        :componentName='getComponentName(p)'
        :bind='getOption(name)'
        :props='config.props'
        :propsConfig='config.propsConfig'
        :cid='config.cid'
        :isEventBind='isEventBind(p)'
        @change='fileChanged'
      />
    </div>
    
    <space/>
    
    <h4 @click='showVspecial = !showVspecial' class='clbutton'>
      <a-icon type="caret-down" v-if='showVspecial'/> 
      <a-icon type='caret-up' v-else/>
      控制属性
    </h4>
    <cl-adj-vspecial :config='config' v-if='showVspecial'/>
    
  </div>
</template>

<script>
const clib = require("./component-library.js");
const tool = require("./tool.js");

const compMap = {
  1:'a-input',
  2:'a-input-number',
  3:'a-select',
  4:'a-input',
  5:'a-input',
  6:'cl-select-fa-icon',
};

export default {
  props: ['config'],
  components : tool.loadc('cl-select-fa-icon', 'cl-attr-dynamic', 'cl-attr-fixed', 
    'cl-attr-bind-data', 'cl-adj-vspecial'),
    
  data() {
    return {
      showVspecial: false,
    };
  },
  
  computed: {
    componentCfg() {
      return clib.getComponent(this.config.cid);
    },
  },
  
  methods: {
    getComponentName(p) {
      if (p.type == 7) {
        if (!p.component) throw new Error("component is null");
        return p.component;
      }
      return compMap[p.type];
    },
    
    getGasketName(p, name) {
      if (p.propsConfig) {
        switch (p.propsConfig.type) {
        // 设计时属性一定是常量
        case 'design':
          return 'cl-attr-fixed';
          
        case 'event':
          return 'cl-attr-dynamic';
        }
      }
      return p.canDynamic ? 'cl-attr-dynamic' : 'cl-attr-fixed';
    },
    
    getComponentProps() {
      return this.componentCfg.props;
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
      let p = this.componentCfg.props[name];
      // 1:字符串, 2:整数, 3:选项select属性, 4:字符串,并且带有select选项, 
      // 5:来自变量, 6:图标选择, 7:自定义插件, 8:事件专用
      switch (p.type) {
        case 1:
          return { maxLength: p.max };
        case 2:
          return { min: p.min, max: p.max, };
        case 3:
          let options = this._getSelectOpt(p.select);
          return { 'default-value': p.def, options, style: 'width: 100%', 'allowClear': true };
        case 4:
          return {};
        case 5:
          return {};
        case 6:
          return { style: 'width: 100%' };
        case 7:
          return p.props || {};
        case 8:
          return { isEvent : true };
        default:
          throw new Error("无效的值类型"+ p.type);
      }
    },
    
    removeComponent() {
      this.$store.commit('removeNestedItem');
      this.fileChanged();
    },
    
    fileChanged() {
      this.$store.commit('setEditFileChanged', true);
    },
    
    isEventBind(p) {
      return (p.type == 8 || (p.propsConfig && p.propsConfig.type == "event"));
    },
  },
}
</script>

<style scoped>
.space {
  margin: 2px 0;
}
space {
  height: 1em; width: 100%; display: block;
}
.clbutton {
  cursor: pointer;
}
.clbutton:hover {
  background-color: #eee;
}
</style>