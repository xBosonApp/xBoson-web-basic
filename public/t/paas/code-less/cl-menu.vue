<!-- Create By xBoson System -->

<template>
  <div class='root'>
    <a class='title' href='http://xboson.net' target='_blank'>xBoson 低代码开发平台</a>
    <a class='logo'>xBoson</a>
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        文件 <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="0">
          <a href='#' @click='createComponent'>新建组件</a>
        </a-menu-item>
        <a-menu-item key="1">
          <a href="#" @click='openComponent'>打开组件</a>
        </a-menu-item>
        <a-menu-item key="2">
          <a href="#" @click='managerComponent'>组件管理</a>
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
      </a-menu>
    </a-dropdown>
    
    <a-drawer
      title="打开组件"
      placement="top"
      height='calc(100% - 80px)'
      :closable="true"
      :visible="showOpen"
      @close="showOpen = false">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    
    <a-drawer
      title="新建组件"
      placement="top"
      height='calc(100% - 80px)'
      :closable="true"
      :visible="showCreate"
      @close="showCreate = false">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    
    <a-drawer
      title="组件管理"
      placement="top"
      height='calc(100% - 80px)'
      :closable="true"
      :visible="showMgr"
      @close="showMgr = false">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCreate : false,
      showOpen : false,
      showMgr : false,
    };
  },
  
  methods: {
    createComponent() {
      this.showCreate = true;
    },
    openComponent() {
      this.showOpen = true;
    },
    managerComponent() {
      this.showMgr = true;
    },
  },
}
</script>

<style scoped>
.root {
  padding-left: 20px;
}
.title {
  float: right; color: #ccc; padding-right: 20px;
}
.logo {
  color: #ccc;
}
.ant-dropdown-link {
  padding-left: 20px;
}
.ant-dropdown-menu-item {
  padding: 0 80px 0 20px;
}
</style>