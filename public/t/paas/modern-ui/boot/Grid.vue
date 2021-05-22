<!-- Create By xBoson System -->
<template><doc class='bootstrap-demo'>


<h2>布局与网格(Layout and Grid System)</h2>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row>
    <b-col>1 of 3</b-col>
    <b-col>2 of 3</b-col>
    <b-col>3 of 3</b-col>
  </b-row>
</b-container>
</a></demo>

<h3>默认容器</h3>
<demo :x='x'><a v-pre><b-container>
  !-- Content here --
</b-container>
</a></demo>

<h3>弹性容器</h3>
<demo :x='x'><a v-pre><b-container fluid>
  !-- Content here --
</b-container>
</a></demo>

<h3>响应式液体容器</h3>
<demo :x='x'><a v-pre><b-container fluid="sm">
  100% wide until small breakpoint
</b-container>
<b-container fluid="md">
  100% wide until medium breakpoint
</b-container>
<b-container fluid="lg">
  100% wide until large breakpoint
</b-container>
<b-container fluid="xl">
  100% wide until extra large breakpoint
</b-container>
</a></demo>

<h3>等宽列</h3>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row>
    <b-col>1 of 2</b-col>
    <b-col>2 of 2</b-col>
  </b-row>

  <b-row>
    <b-col>1 of 3</b-col>
    <b-col>2 of 3</b-col>
    <b-col>3 of 3</b-col>
  </b-row>
</b-container>
</a></demo>

<h3>等宽多行</h3>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row>
    <b-col>Column</b-col>
    <b-col>Column</b-col>
    <div class="w-100"></div>
    <b-col>Column</b-col>
    <b-col>Column</b-col>
  </b-row>
</b-container>
</a></demo>

<h3>设置一列宽度</h3>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row class="text-center">
    <b-col>1 of 3</b-col>
    <b-col cols="8">2 of 3 (wider)</b-col>
    <b-col>3 of 3</b-col>
  </b-row>

  <b-row class="text-center">
    <b-col>1 of 3</b-col>
    <b-col cols="5">2 of 3 (wider)</b-col>
    <b-col>3 of 3</b-col>
  </b-row>
</b-container>
</a></demo>

<h3>可变宽度内容</h3>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row class="justify-content-md-center">
    <b-col col lg="2">1 of 3</b-col>
    <b-col cols="12" md="auto">Variable width content</b-col>
    <b-col col lg="2">3 of 3</b-col>
  </b-row>

  <b-row>
    <b-col>1 of 3</b-col>
    <b-col cols="12" md="auto">Variable width content</b-col>
    <b-col col lg="2">3 of 3</b-col>
  </b-row>
</b-container>
</a></demo>

<h3>所有断点</h3>
<demo :x='x'><a v-pre><b-container class="bv-example-row">
  <b-row>
    <b-col>col</b-col>
    <b-col>col</b-col>
    <b-col>col</b-col>
    <b-col>col</b-col>
  </b-row>

  <b-row>
    <b-col cols="8">col-8</b-col>
    <b-col cols="4">col-4</b-col>
  </b-row>
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
.bootstrap-demo .col {
  background-color: #8ec4f3; border: 1px solid #fff; color: #fff;
}
</style>