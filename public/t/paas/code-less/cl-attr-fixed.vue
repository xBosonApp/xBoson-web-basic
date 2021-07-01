<!-- Create By xBoson System -->

<template>
  <div>
    <div>{{desc}}</div>
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      @change='onChange'
    />
  </div>
</template>

<script>
export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig'],
  
  methods: {
    onChange() {
      this.$emit('change');
    },
  },
}
</script>

<style scoped>
</style>