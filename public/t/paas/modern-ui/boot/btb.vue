<!-- Create By xBoson System -->
<template><doc>


<h2>按钮Toolbar(Button toolbar)</h2>
<h6>示例1： 使用按钮组 & 键盘导航</h6>
<demo :x='x'><a v-pre><div>
  <b-button-toolbar key-nav aria-label="Toolbar with button groups">
    <b-button-group class="mx-1">
      <b-button>&laquo;</b-button>
      <b-button>&lsaquo;</b-button>
    </b-button-group>
    <b-button-group class="mx-1">
      <b-button>Edit</b-button>
      <b-button>Undo</b-button>
      <b-button>Redo</b-button>
    </b-button-group>
    <b-button-group class="mx-1">
      <b-button>&rsaquo;</b-button>
      <b-button>&raquo;</b-button>
    </b-button-group>
  </b-button-toolbar>
</div>
</a></demo>

<h6>示例2： 混合使用小按钮组和小输入组</h6>
<demo :x='x'><a v-pre><div>
  <b-button-toolbar aria-label="Toolbar with button groups and input groups">
    <b-button-group size="sm" class="mr-1">
      <b-button>Save</b-button>
      <b-button>Cancel</b-button>
    </b-button-group>
    <b-input-group size="sm" prepend="$" append=".00">
      <b-form-input value="100" class="text-right"></b-form-input>
    </b-input-group>
  </b-button-toolbar>
</div>
</a></demo>

<h6>示例3： 按钮组和下拉菜单</h6>
<demo :x='x'><a v-pre><div>
  <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
    <b-button-group class="mx-1">
      <b-button>New</b-button>
      <b-button>Edit</b-button>
      <b-button>Undo</b-button>
    </b-button-group>
    <b-dropdown class="mx-1" right text="menu">
      <b-dropdown-item>Item 1</b-dropdown-item>
      <b-dropdown-item>Item 2</b-dropdown-item>
      <b-dropdown-item>Item 3</b-dropdown-item>
    </b-dropdown>
    <b-button-group class="mx-1">
      <b-button>Save</b-button>
      <b-button>Cancel</b-button>
    </b-button-group>
  </b-button-toolbar>
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