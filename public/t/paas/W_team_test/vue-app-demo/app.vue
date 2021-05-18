<template>
  <div>
    <div>{{ msg }} {{count}}</div>
    <el-button v-on:click="count++">You clicked me {{ count }} times.</el-button> 
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!',
      count: 0,
    }
  }
}
</script>