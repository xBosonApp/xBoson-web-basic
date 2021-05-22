<!-- Create By xBoson System -->
<template><doc>


<h2>面包屑导航(Breadcrumb)</h2>
<demo :x='x'><a v-pre><template>
  <b-breadcrumb :items="items"></b-breadcrumb>
</template>
</a></demo>

<h3>手动放置项目</h3>
<demo :x='x'><a v-pre><template>
  <b-breadcrumb>
    <b-breadcrumb-item href="#home">
      <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      Home
    </b-breadcrumb-item>
    <b-breadcrumb-item href="#foo">Foo</b-breadcrumb-item>
    <b-breadcrumb-item href="#bar">Bar</b-breadcrumb-item>
    <b-breadcrumb-item active>Baz</b-breadcrumb-item>
  </b-breadcrumb>
</template></a></demo>


</doc></template>

<script>
let x = {
  data() {
    return {
      items: [
        {
          text: 'Admin',
          href: '#'
        },
        {
          text: 'Manage',
          href: '#'
        },
        {
          text: 'Library',
          active: true
        }
      ]
    }
  }
}
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>