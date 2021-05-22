<!-- Create By xBoson System -->

<template><doc>
  

<h2>徽章(Badge)</h2>
<demo :x='x'><a v-pre><div>
  <h2>Example heading <b-badge>New</b-badge></h2>
  <h3>Example heading <b-badge>New</b-badge></h3>
  <h4>Example heading <b-badge>New</b-badge></h4>
  <h5>Example heading <b-badge>New</b-badge></h5>
  <h6>Example heading <b-badge>New</b-badge></h6>
</div></a></demo>

<h3>上下文差异</h3>
<demo :x='x'><a v-pre><div>
  <b-badge variant="primary">Primary</b-badge>
  <b-badge variant="secondary">Secondary</b-badge>
  <b-badge variant="success">Success</b-badge>
  <b-badge variant="danger">Danger</b-badge>
  <b-badge variant="warning">Warning</b-badge>
  <b-badge variant="info">Info</b-badge>
  <b-badge variant="light">Light</b-badge>
  <b-badge variant="dark">Dark</b-badge>
</div></a></demo>

<h3>药丸徽章</h3>
<demo :x='x'><a v-pre><div>
  <b-badge pill variant="primary">Primary</b-badge>
  <b-badge pill variant="secondary">Secondary</b-badge>
  <b-badge pill variant="success">Success</b-badge>
  <b-badge pill variant="danger">Danger</b-badge>
  <b-badge pill variant="warning">Warning</b-badge>
  <b-badge pill variant="info">Info</b-badge>
  <b-badge pill variant="light">Light</b-badge>
  <b-badge pill variant="dark">Dark</b-badge>
</div></a></demo>

<h3>可操作的徽章</h3>
<demo :x='x'><a v-pre><div>
  <b-badge href="#" variant="primary">Primary</b-badge>
  <b-badge href="#" variant="secondary">Secondary</b-badge>
  <b-badge href="#" variant="success">Success</b-badge>
  <b-badge href="#" variant="danger">Danger</b-badge>
  <b-badge href="#" variant="warning">Warning</b-badge>
  <b-badge href="#" variant="info">Info</b-badge>
  <b-badge href="#" variant="light">Light</b-badge>
  <b-badge href="#" variant="dark">Dark</b-badge>
</div></a></demo>

  
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