<!-- Create By xBoson System -->

<template>
  <div class='colrow xrc'>
    <slot></slot>
  </div>
</template>

<script>
//
// 自身是列单元, 内部为行布局
//
export default {
}
</script>

<style scoped>
.colrow {
  display: flex; height: 100%; flex-direction: column; flex: 1;
}
.colrow > *:not(:first-child) {
  margin-top: 20px;
}
</style>