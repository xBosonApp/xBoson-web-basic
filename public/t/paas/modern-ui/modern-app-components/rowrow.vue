<!-- Create By xBoson System -->

<template>
  <div class='rowrow xrc'>
    <slot></slot>
  </div>
</template>

<script>
//
// 自身是行单元, 内部为行布局
//
export default {
}
</script>

<style scoped>
.rowrow {
  display: flex; width: 100%; flex-direction: column; flex: 1;
}
.rowrow > *:not(:first-child) {
  margin-top: 20px;
}
</style>