<!-- Create By xBoson System -->

<template>
  <div class='page-design'>
    <div class='dd-footer' v-if='showtip()'>拖拽组件到这里</div>
    <cl-component-container :nested-list='list' :root-config='root'></cl-component-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list : [],
      root : {
        id : 0,
      },
    }
  },
  
  methods : {
    showtip() {
      return this.list.length == 0 && this.$store.state.showDropTip;
    },
  },
}
</script>

<style scoped>
.dd-footer {
  text-align: center; color: #999; padding: 0px 0; background-color: #eee; 
  width: calc(100% - 22px); font-size: 1.3em; position: absolute; margin:1px;
}
</style>