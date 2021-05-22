<!-- Create By xBoson System -->
<template><doc>


<h2>按钮(Button)</h2>
<demo :x='x'><a v-pre><div>
  <b-button>Button</b-button>
  <b-button variant="danger">Button</b-button>
  <b-button variant="success">Button</b-button>
  <b-button variant="outline-primary">Button</b-button>
</div></a></demo>

<h3>元素类型</h3>
<demo :x='x'><a v-pre><div>
  <b-button>I am a Button</b-button>
  <b-button href="#">I am a Link</b-button>
</div></a></demo>

<h3>尺寸</h3>
<demo :x='x'><a v-pre><b-row>
  <b-col lg="4" class="pb-2"><b-button size="sm">Small Button</b-button></b-col>
  <b-col lg="4" class="pb-2"><b-button>Default Button</b-button></b-col>
  <b-col lg="4" class="pb-2"><b-button size="lg">Large Button</b-button></b-col>
</b-row>
</a></demo>

<h3>纯色变量</h3>
<demo :x='x'><a v-pre><div>
  <b-button variant="primary">Primary</b-button>
  <b-button variant="secondary">Secondary</b-button>
  <b-button variant="success">Success</b-button>
  <b-button variant="danger">Danger</b-button>
  <b-button variant="warning">Warning</b-button>
  <b-button variant="info">Info</b-button>
  <b-button variant="light">Light</b-button>
  <b-button variant="dark">Dark</b-button>
</div>
</a></demo>

<h3>轮廓颜色变量</h3>
<demo :x='x'><a v-pre><div>
  <b-button variant="outline-primary">Primary</b-button>
  <b-button variant="outline-secondary">Secondary</b-button>
  <b-button variant="outline-success">Success</b-button>
  <b-button variant="outline-danger">Danger</b-button>
  <b-button variant="outline-warning">Warning</b-button>
  <b-button variant="outline-info">Info</b-button>
  <b-button variant="outline-light">Light</b-button>
  <b-button variant="outline-dark">Dark</b-button>
</div>
</a></demo>

<h3>链接变量</h3>
<demo :x='x'><a v-pre><div>
  <b-button variant="link">Link</b-button>
</div>
</a></demo>

<h3>块级按钮</h3>
<demo :x='x'><a v-pre><div>
  <b-button block variant="primary">Block Level Button</b-button>
</div>
</a></demo>

<h3>药丸风格</h3>
<demo :x='x'><a v-pre><div>
  <b-button pill>Button</b-button>
  <b-button pill variant="primary">Button</b-button>
  <b-button pill variant="outline-secondary">Button</b-button>
  <b-button pill variant="success">Button</b-button>
  <b-button pill variant="outline-danger">Button</b-button>
  <b-button pill variant="info">Button</b-button>
</div>
</a></demo>

<h3>方块风格</h3>
<demo :x='x'><a v-pre><div>
  <b-button squared>Button</b-button>
  <b-button squared variant="primary">Button</b-button>
  <b-button squared variant="outline-secondary">Button</b-button>
  <b-button squared variant="success">Button</b-button>
  <b-button squared variant="outline-danger">Button</b-button>
  <b-button squared variant="info">Button</b-button>
</div>
</a></demo>

<h3>禁用状态</h3>
<demo :x='x'><a v-pre><div>
  <b-button disabled size="lg" variant="primary">Disabled</b-button>
  <b-button disabled size="lg">Also Disabled</b-button>
</div>
</a></demo>
  
  
</doc></template>

<script>
let x = {};
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>