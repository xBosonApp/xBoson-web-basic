<!-- Create By xBoson System -->

<template>
  <div class='fr'>
    <div class='ti'><b class='txt'>{{ title }}</b></div>
    <div class='ct'><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style scoped>
.ti {
  background-color: #090957; min-height: 1.5em; padding: 1px 4px;
}
.fr {
  border: 1px solid #131378; min-height: 100px; margin: 10px 5px;
}
.ct {
  padding: 4px;
}
</style>