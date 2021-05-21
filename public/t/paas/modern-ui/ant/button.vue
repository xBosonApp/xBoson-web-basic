<!-- Create By xBoson System -->

<template><doc>
  <h2>Button 按钮</h2>
  <p>按钮有五种类型：主按钮、次按钮、虚线按钮、危险按钮和链接按钮。主按钮在同一个操作区域最多出现一次。</p>
  <demo-layout>
    <div v-pre>
<div>
  <a-button type="primary">
    Primary
  </a-button>
  <a-button>Default</a-button>
  <a-button type="dashed">
    Dashed
  </a-button>
  <a-button type="danger">
    Danger
  </a-button>
  <a-config-provider :auto-insert-space-in-button="false">
    <a-button type="primary">
      按钮
    </a-button>
  </a-config-provider>
  <a-button type="primary">
    按钮
  </a-button>
  <a-button type="link">
    Link
  </a-button>
</div>
    </div>
  </demo-layout>
  
  <h3>按钮组合</h3>
  <p>可以将多个 Button 放入 Button.Group 的容器中。
通过设置 size 为 large small 分别把按钮组合设为大、小尺寸。若不设置 size，则尺寸为中。</p>
  <demo-layout>
    <div v-pre>
<div id="components-button-demo-button-group">
  <h4>Basic</h4>
  <a-button-group>
    <a-button>Cancel</a-button>
    <a-button type="primary">
      OK
    </a-button>
  </a-button-group>
  <a-button-group>
    <a-button disabled>
      L
    </a-button>
    <a-button disabled>
      M
    </a-button>
    <a-button disabled>
      R
    </a-button>
  </a-button-group>
  <a-button-group>
    <a-button type="primary">
      L
    </a-button>
    <a-button>M</a-button>
    <a-button>M</a-button>
    <a-button type="dashed">
      R
    </a-button>
  </a-button-group>

  <h4>With Icon</h4>
  <a-button-group>
    <a-button type="primary"> <a-icon type="left" />Go back </a-button>
    <a-button type="primary"> Go forward<a-icon type="right" /> </a-button>
  </a-button-group>
  <a-button-group>
    <a-button type="primary" icon="cloud" />
    <a-button type="primary" icon="cloud-download" />
  </a-button-group>
</div>
    </div>
  </demo-layout>
  
  <h3>不可用状态</h3>
  <demo-layout><div v-pre>
  <div>
    <a-button type="primary">
      Primary
    </a-button>
    <a-button type="primary" disabled>
      Primary(disabled)
    </a-button>
    <br />
    <a-button>Default</a-button>
    <a-button disabled>
      Default(disabled)
    </a-button>
    <br />
    <a-button type="dashed">
      Dashed
    </a-button>
    <a-button type="dashed" disabled>
      Dashed(disabled)
    </a-button>
    <br />
    <a-button type="link">
      Link
    </a-button>
    <a-button type="link" disabled>
      Link(disabled)
    </a-button>
    <div :style="{ padding: '8px 8px 0 8px', background: 'rgb(190, 200, 200)' }">
      <a-button ghost>
        Ghost
      </a-button>
      <a-button ghost disabled>
        Ghost(disabled)
      </a-button>
    </div>
  </div>
  </div></demo-layout>
  
  <h3>幽灵按钮</h3>
  <p>幽灵按钮将其他按钮的内容反色，背景变为透明，常用在有色背景上。</p>
  <demo-layout><div v-pre>
<template>
  <div :style="{ background: 'rgb(190, 200, 200)', padding: '26px 16px 16px' }">
    <a-button type="primary" ghost>
      Primary
    </a-button>
    <a-button ghost>
      Default
    </a-button>
    <a-button type="dashed" ghost>
      Dashed
    </a-button>
    <a-button type="danger" ghost>
      Danger
    </a-button>
    <a-button type="link" ghost>
      Link
    </a-button>
  </div>
</template>
  </div></demo-layout>
  
  <h3>图标按钮</h3>
  <p>当需要在 Button 内嵌入 Icon 时，可以设置 icon 属性，或者直接在 Button 内使用 Icon 组件。
如果想控制 Icon 具体的位置，只能直接使用 Icon 组件，而非 icon 属性。</p>
  <demo-layout><div v-pre>
<template>
  <div>
    <a-button type="primary" shape="circle" icon="search" />
    <a-button type="primary" shape="circle">
      A
    </a-button>
    <a-button type="primary" icon="search">
      Search
    </a-button>
    <a-button shape="circle" icon="search" />
    <a-button icon="search">
      Search
    </a-button>
    <a-button shape="circle" icon="search" />
    <a-button icon="search">
      Search
    </a-button>
    <a-button type="dashed" shape="circle" icon="search" />
    <a-button type="dashed" icon="search">
      Search
    </a-button>
  </div>
</template>
  </div></demo-layout>
  
  <h3>加载中状态</h3>
  <demo-layout :x='x'><div v-pre>
<template>
  <div>
    <a-button type="primary" loading>
      Loading
    </a-button>
    <a-button type="primary" size="small" loading>
      Loading
    </a-button>
    <br />
    <a-button type="primary" :loading="loading" >
      mouseenter me!
    </a-button>
    <a-button type="primary" icon="poweroff" :loading="iconLoading" >
      延迟1s
    </a-button>
    <br />
    <a-button type="primary" loading />
    <a-button type="primary" shape="circle" loading />
    <a-button type="danger" shape="round" loading />
  </div>
</template>
  </div></demo-layout>
  
  <h3>多个按钮组合</h3>
  <demo-layout><div v-pre><template>
    <div>
      <a-button type="primary">
        Primary
      </a-button>
      <a-button>secondary</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1">
            1st item
          </a-menu-item>
          <a-menu-item key="2">
            2nd item
          </a-menu-item>
          <a-menu-item key="3">
            3rd item
          </a-menu-item>
        </a-menu>
        <a-button> Actions <a-icon type="down" /> </a-button>
      </a-dropdown>
    </div>
  </template>
  </div></demo-layout>
  
  <h3>按钮尺寸</h3>
  <demo-layout><div v-pre>
    <template>
  <div>
    <a-radio-group :value="size" >
      <a-radio-button value="large">
        Large
      </a-radio-button>
      <a-radio-button value="default">
        Default
      </a-radio-button>
      <a-radio-button value="small">
        Small
      </a-radio-button>
    </a-radio-group>
    <br><br>
    <a-button type="primary" :size="size">
      Primary
    </a-button>
    <a-button :size="size">
      Normal
    </a-button>
    <a-button type="dashed" :size="size">
      Dashed
    </a-button>
    <a-button type="danger" :size="size">
      Danger
    </a-button>
    <a-button type="link" :size="size">
      Link
    </a-button>
    <br>
    <a-button type="primary" icon="download" :size="size" />
    <a-button type="primary" shape="circle" icon="download" :size="size" />
    <a-button type="primary" shape="round" icon="download" :size="size" />Download</a-button>
    <a-button type="primary" shape="round" icon="download" :size="size" />
    <a-button type="primary" icon="download" :size="size">
      Download
    </a-button>
    <br>
    <a-button-group :size="size">
      <a-button type="primary">
        <a-icon type="left" />Backward
      </a-button>
      <a-button type="primary">
        Forward<a-icon type="right" />
      </a-button>
    </a-button-group>
  </div>
</template>
  </div></demo-layout>
</doc></template>


<script>
export default {
  data() {
    return {
      x:{
        data: {
          loading: false,
          iconLoading: false,
          size: 'large',
        },
        
        methods: {
          enterLoading() {
            this.loading = true;
          },
          enterIconLoading() {
            this.iconLoading = { delay: 1000 };
          },
        },
      }
    }
  }
}
</script>

<style scoped>
.ant-btn {
  margin: 8px;
}
</style>