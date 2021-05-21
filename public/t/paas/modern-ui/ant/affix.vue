<!-- Create By xBoson System -->

<template><doc style='height: 3000px'>
  <h2>Affix 固钉</h2>
  <p>将页面元素钉在可视范围。</p>
  
  <demo :x='x'>
  <div v-pre>
    <a-affix :offset-top="top">
      <a-button type="primary" >
        Affix top
      </a-button>
    </a-affix>
    <br />
    <a-affix :offset-bottom="b">
      <a-button type="primary" >
        Affix bottom
      </a-button>
    </a-affix>
  </div>
  </demo>
  
  <h3>滚动容器</h3>
  <demo :x='x'>
  <div v-pre id="components-affix-demo-target" >
    <div style="height: 100px;  overflow-y: scroll;">
    <div class="background" style="padding-top: 60px;  height: 300px;  background-color: red;">
      <a-affix :target="() => this.$refs.container">
        <a-button type="primary">
          Fixed at the top of container
        </a-button>
      </a-affix>
    </div>
    </div>
  </div>
  </demo>
  
</doc></template>

<script>
export default {
  data() {
    return {
      x:{
        data:{
          top: 10,
          b: 10,
        }
      }
    };
  }
}
</script>

<style>
</style>