<!-- Create By xBoson System -->

<template><doc>
  <h2>下拉菜单</h2>
  <demo><a v-pre>
    <template>
  <a-dropdown>
    <a class="ant-dropdown-link" >
      Hover me <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a href="javascript:;">1st menu item</a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript:;">2nd menu item</a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript:;">3rd menu item</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
  </a></demo>
  
  <h3>带下拉框的按钮</h3>
  <demo><a v-pre>
    <template>
  <div>
    <a-dropdown-button >
      Dropdown
      <a-menu slot="overlay" >
        <a-menu-item key="1"> <a-icon type="user" />1st menu item </a-menu-item>
        <a-menu-item key="2"> <a-icon type="user" />2nd menu item </a-menu-item>
        <a-menu-item key="3"> <a-icon type="user" />3rd item </a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-dropdown-button>
      Dropdown
      <a-menu slot="overlay" >
        <a-menu-item key="1"> <a-icon type="user" />1st menu item </a-menu-item>
        <a-menu-item key="2"> <a-icon type="user" />2nd menu item </a-menu-item>
        <a-menu-item key="3"> <a-icon type="user" />3rd item </a-menu-item>
      </a-menu>
      <a-icon slot="icon" type="user" />
    </a-dropdown-button>
    <a-dropdown-button disabled style="margin-left: 8px" >
      Dropdown
      <a-menu slot="overlay" >
        <a-menu-item key="1"> <a-icon type="user" />1st menu item </a-menu-item>
        <a-menu-item key="2"> <a-icon type="user" />2nd menu item </a-menu-item>
        <a-menu-item key="3"> <a-icon type="user" />3rd item </a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-dropdown>
      <a-menu slot="overlay" >
        <a-menu-item key="1"> <a-icon type="user" />1st menu item </a-menu-item>
        <a-menu-item key="2"> <a-icon type="user" />2nd menu item </a-menu-item>
        <a-menu-item key="3"> <a-icon type="user" />3rd item </a-menu-item>
      </a-menu>
      <a-button style="margin-left: 8px"> Button <a-icon type="down" /> </a-button>
    </a-dropdown>
  </div>
</template>
  </a></demo>
  
  <h3>右键菜单</h3>
  <demo><a v-pre>
    <template>
  <a-dropdown :trigger="['contextmenu']">
    <div
      :style="{
        textAlign: 'center',
        background: '#f7f7f7',
        height: '200px',
        lineHeight: '200px',
        color: '#777',
      }"
    >
      Right Click on here
    </div>
    <a-menu slot="overlay">
      <a-menu-item key="1">
        1st menu item
      </a-menu-item>
      <a-menu-item key="2">
        2nd menu item
      </a-menu-item>
      <a-menu-item key="3">
        3rd menu item
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
  </a></demo>
  
  <h3>弹出位置</h3>
  <demo :x='x'><a v-pre>
  <div id="components-dropdown-demo-placement">
    <div v-for="(placement, index) in placements">
      <a-dropdown :placement="placement">
        <a-button>{{ placement }}</a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" 
              >1st menu item</a
            >
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" 
              >2nd menu item</a
            >
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" 
              >3rd menu item</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <br v-if="index === 2" />
    </div>
  </div>
  </a></demo>
  
</doc></template>

<script>
export default {
  data() {
    return {
      x:{
        data:{
          index:0,
          placement:'',
          placements: ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'],
        }
      }
    }
  }
}
</script>


<style>
#components-dropdown-demo-placement .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>