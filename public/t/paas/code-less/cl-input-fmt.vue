<!-- Create By xBoson System -->

<template>
  <a-input 
    :value='value' 
    :placeholder='placeholder' 
    @change='change'/>
</template>

<script>
export default {
  props: ['value', 'format', 'placeholder'],
  
  methods: {
    change(e) {
      let v = e.data;
      if (this.format) {
        v = this.format(v);
      }
      this.value = v;
      this.$emit('input', v);
      this.$emit("change");
    }
  }
}
</script>

<style>
</style>