<!-- Create By xBoson System -->

<template><doc>
  <h2>加载占位图</h2>
  <demo :x='x'><a v-pre><template>
  <a-skeleton />
</template>
</a></demo>
  
  <h3>复杂的组合</h3>
  <demo :x='x'><a v-pre><template>
  <a-skeleton avatar :paragraph="{ rows: 4 }" />
</template>
</a></demo>
  
  <h3>动画效果</h3>
  <demo :x='x'><a v-pre><template>
  <a-skeleton active />
</template>
</a></demo>
  
  
</doc></template>

<script>
let x = {};
export default {
  data() {
    return {x}
  }
}
</script>

<style>
</style>