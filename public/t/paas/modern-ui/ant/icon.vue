<!-- Create By xBoson System -->

<template><doc>
  
<h2>图标 Icon</h2>
<p>语义化的矢量图形。</p>
<demo-layout><div v-pre>
<template>
<div class="icons-list">
<a-icon type="home" />
<a-icon type="setting" theme="filled" />
<a-icon type="smile" theme="outlined" />
<a-icon type="sync" spin />
<a-icon type="smile" :rotate="180" />
<a-icon type="loading" />
</div>
</template>
</div></demo-layout>

<h3>多色图标</h3>
<demo-layout><div v-pre>
<template>
  <div class="icons-list">
    <a-icon type="smile" theme="twoTone" />
    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" />
    <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
  </div>
</template>
</div></demo-layout>
    
</doc></template>

<script>
export default {
}
</script>

<style scoped>
.icons-list * {
  font-size: 40px;
}
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}
</style>