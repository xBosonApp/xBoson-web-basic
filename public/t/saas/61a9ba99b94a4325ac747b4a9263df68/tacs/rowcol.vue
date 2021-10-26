<!-- Create By xBoson System -->

<template>
  <div class='rowcol xrc'>
    <slot></slot>
  </div>
</template>

<script>
//
// 自身是行单元, 内部为列布局
//
export default {
}
</script>

<style scoped>
.rowcol {
  display: flex; width: 100%; flex-direction: row; flex: 1;
}
.rowcol > *:not(:first-child) {
  margin-left: 10px;
}
</style>