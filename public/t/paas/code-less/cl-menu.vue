<!-- Create By xBoson System -->

<template>
  <div class='root'>
    <a class='title' href='http://xboson.net' target='_blank'>xBoson 低代码开发平台</a>
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        文件 <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="0">
          <a href='#'>新建组件</a>
        </a-menu-item>
        <a-menu-item key="1">
          <a href="#">打开组件</a>
        </a-menu-item>
        <a-menu-item key="2">
          <a href="#">组件管理</a>
        </a-menu-item>
        
        <a-menu-divider />
        <a-menu-item key="3" disabled>
          退出
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        选项 <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="0">
          <a href='#'>页面设置</a>
        </a-menu-item>
        <a-menu-item key="3">
          <a href='#'>组件注册表</a>
        </a-menu-item>
        <a-menu-item key="6">
          <a href="#">虚拟菜单</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.root {
  padding-left: 20px;
}
.title {
  float: right; color: #ccc; padding-right: 20px;
}
.ant-dropdown-link {
  padding-left: 20px;
}
</style>