<!-- Create By xBoson System -->

<template>
<div>
  <b><slot></slot></b>
  <div class='items-group ig'>
    <div v-for='(v, k) in $attrs' v-if='!block[k]'><i class='k'>{{k}}</i> : <i class='v'>{{v}}</i></div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      block: { rootConfig:1, styleProp:1, nestedList:1, }
    };
  },
}
</script>

<style scoped>
.ig { grid-template-columns: 1fr 1fr 1fr 1fr }
.k  { color: #aaa; }
.v  { color: blue; }
</style>