<!-- Create By xBoson System -->

<template>
<div>
  <a-table :columns="head" :data-source="data" :pagination='false'>
    <template slot='rTitle' slot-scope="t, r">
      <span :style="r.style">
        {{ r.title }}
      </span>
    </template>
    
    <template slot='rIcon' slot-scope='t, r'>
      <i :class='t'></i>
    </template>
    
    <template slot='rRoles' slot-scope='t, r'>
      <a-tag v-for='id in r.roles'>
        {{ rolesMap[id] || '[读取..]' }}
      </a-tag>
    </template>
  </a-table>
    
  <x-api org='a297dfacd7a84eab9656675f61750078'
    app='19cb7c3b79e949b88a9c76396854c2b1'
    mod='prjmgr' api='roleslist' 
    @success='setRolesList' />
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['menu', 'nomenu'],
  
  data() {
    return {
      head : [
        { title: '标题', dataIndex:'title', scopedSlots: { customRender: 'rTitle' } },
        { title: '图标', dataIndex:'icon', scopedSlots: { customRender: 'rIcon' } },
        { title: '虚拟路径', dataIndex:'path' },
        { title: '访问角色', dataIndex:'roles', scopedSlots: { customRender: 'rRoles' } },
      ],
      data : [],
      rolesMap : {},
    };
  },
  
  mounted() {
    this.initData();
  },
  
  methods : {
    initData() {
      let data = [];
      let deep = 0;
      
      let _a = (m)=>{
        let style = {
          color: 'black',
          paddingLeft : deep * 25 +'px',
        };
        
        if (m.isContainer) {
          style.color = 'blue';
          data.push(Object.assign({style}, m, {child:null}));
          this.putRole(m.roles);
          
          ++deep;
          m.child.forEach(_a);
          --deep;
        } else {
          let ref = this.nomenu[m.id];
          let x = Object.assign({style}, ref);
          this.putRole(ref.roles);
          data.push(x);
        }
      }
      
      this.menu.forEach(_a);
      this.data = data;
    },
    
    setRolesList(v) {
      v.roles.forEach(d=>{
        this.$set(this.rolesMap, d.id, d.name);
      });
    },
    
    putRole(a) {
      if (!a) return;
      a.forEach(r=>{
        if (!this.rolesMap[r]) {
          this.rolesMap[r] = '[读取..]';
        }
      });
    },
    
    rRoles(rv, rd, ri) {
      let buf = [];
      if (rd.roles) {
        rd.roles.forEach(r=>{
          buf.push(this.rolesMap[r]);
        });
      }
      return buf.join(' ');
    },
  },
}
</script>

<style scoped>
</style>