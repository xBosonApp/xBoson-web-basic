<!-- Create By xBoson System -->

<template>
<div>
  <x-api org='a297dfacd7a84eab9656675f61750078'
    app='19cb7c3b79e949b88a9c76396854c2b1'
    mod='prjmgr' api='roleslist' 
    @success='setRolesList' />
    
  <a-select
    mode="multiple"
    :value='value'
    @change='onChange'
    placeholder="角色列表">
    <a-select-option v-for="(p, i) in rolelist" :key="p.id">
      {{p.name}}
    </a-select-option>
  </a-select>
</div>
</template>

<script>
export default {
  props: ['value'],
  
  data() {
    return {
      rolelist:[],
    };
  },
  
  methods: {
    setRolesList(v) {
      this.rolelist = v.roles;
    },
    
    onChange(v) {
      this.$emit('input', v);
    },
  },
}
</script>

<style scoped>
</style>