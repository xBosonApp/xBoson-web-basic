<!-- Create By xBoson System -->
<template><doc>


<h2>tip提示组件(Tooltip)</h2>
<demo :x='x'><a v-pre><div class="text-center my-3">
  <b-button v-b-tooltip.hover title="Tooltip directive content">
    Hover Me
  </b-button>

  <b-button id="tooltip-target-1">
    Hover Me
  </b-button>
  <b-tooltip target="tooltip-target-1" triggers="hover">
    I am tooltip <b>component</b> content!
  </b-tooltip>
</div>
</a></demo>

<h3>重点 触发 button 元素的警告</h3>
<demo :x='x'><a v-pre><b-button
  href="#"
  tabindex="0"
  v-b-tooltip.focus
  title="Tooltip title"
>
  Link button with tooltip directive
</b-button>

<b-button id="link-button" href="#" tabindex="0">
  Link button with tooltip component
</b-button>
<b-tooltip target="link-button" title="Tooltip title" triggers="focus">
  Tooltip title
</b-tooltip>
</a></demo>

<h3>禁用元素</h3>
<demo :x='x'><a v-pre><div>
  <span id="disabled-wrapper" class="d-inline-block" tabindex="0">
    <b-button variant="primary" style="pointer-events: none;" disabled>Disabled button</b-button>
  </span>
  <b-tooltip target="disabled-wrapper">Disabled tooltip</b-tooltip>
</div>
</a></demo>

<h3>b-tooltip 组件用法</h3>
<demo :x='x'><a v-pre><b-container fluid>
  <b-row>
    <b-col md="4" class="py-4">
      <b-button id="button-1" variant="outline-success">Live chat</b-button>
    </b-col>
    <b-col md="4" class="py-4">
      <b-button id="button-2" variant="outline-success">Html chat</b-button>
    </b-col>
    <b-col md="4" class="py-4">
      <b-button ref="button-3" variant="outline-success">Alternative chat</b-button>
    </b-col>
  </b-row>

  <!-- Tooltip title specified via prop title -->
  <b-tooltip target="button-1" title="Online!"></b-tooltip>

  <!-- HTML title specified via default slot -->
  <b-tooltip target="button-2" placement="bottom">
    Hello <strong>World!</strong>
  </b-tooltip>

  <!-- Tooltip for an element identified by ref -->
  <b-tooltip :target="() => $refs['button-3']" title="Alternative!"></b-tooltip>
</b-container>
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