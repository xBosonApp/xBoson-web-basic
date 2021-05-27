<!-- Create By xBoson System -->

<template>
  <div class='colcol xrc'>
    <slot></slot>
  </div>
</template>

<script>
//
// 自身是列单元, 内部为列布局
//
export default {
}
</script>

<style scoped>
.colcol {
  display: flex; height: 100%; flex-direction: row; flex: 1;
}
.colcol > *:not(:first-child) {
  margin-left: 20px;
}
</style>