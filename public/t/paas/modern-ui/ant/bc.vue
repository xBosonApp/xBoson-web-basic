<!-- Create By xBoson System -->

<template><doc>
  <h2>Breadcrumb面包屑</h2>
  <demo><div v-pre>
    <template>
  <a-breadcrumb>
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
</template>
  </div></demo>
  
  <h3>带有图标的 </h3>
  <demo><div v-pre>
    <template>
  <a-breadcrumb>
    <a-breadcrumb-item href="">
      <a-icon type="home" />
    </a-breadcrumb-item>
    <a-breadcrumb-item href="">
      <a-icon type="user" />
      <span>Application List</span>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      Application
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
  </div></demo>
  
  <h3>分隔符</h3>
  <demo><a v-pre>
    <template>
  <div>
    <a-breadcrumb separator=">">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">
        Application Center
      </a-breadcrumb-item>
      <a-breadcrumb-item href="">
        Application List
      </a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
    <a-breadcrumb>
      <span slot="separator" style="color: red">></span>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">
        Application Center
      </a-breadcrumb-item>
      <a-breadcrumb-item href="">
        Application List
      </a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
  </a></demo>
  
  <h3>分隔符2</h3>
  <demo><a v-pre>
    <template>
  <a-breadcrumb separator="">
    <a-breadcrumb-item>Location</a-breadcrumb-item>
    <a-breadcrumb-separator>:</a-breadcrumb-separator>
    <a-breadcrumb-item href="">
      Application Center
    </a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item href="">
      Application List
    </a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
</template>
  </a></demo>
  
  <h3>带下拉菜单的面包屑</h3>
  <demo><a v-pre>
    <template>
  <a-breadcrumb>
    <a-breadcrumb-item>Ant Design Vue</a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Component</a></a-breadcrumb-item>
    <a-breadcrumb-item>
      <a href="">General</a>
      <a-menu slot="overlay">
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://xboson.net/">
            General
          </a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://xboson.net/">
            Layout
          </a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://xboson.net/">
            Navigation
          </a>
        </a-menu-item>
      </a-menu>
    </a-breadcrumb-item>
    <a-breadcrumb-item>Button</a-breadcrumb-item>
  </a-breadcrumb>
</template>
  </a></demo>
  
</doc></template>

<script>
export default {
}
</script>

<style>
</style>