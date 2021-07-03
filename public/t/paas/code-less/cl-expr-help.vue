<!-- Create By xBoson System -->

<template>
  <a-drawer
    title="JavaScript"
    placement="right"
    :visible="visible"
    :destroyOnClose='true'
    @close="drawerClose"
    :afterVisibleChange="afterVisibleChange"
    width='350px'
  >
    
<pre>
<h4>表达式:</h4>
  数字: <code>0</code> <code>99.9</code>
  字符串(必须有单引号): <code>'abc'</code>
  上下文变量引用: <code>i</code> <code>v[i].name</code>
  函数调用: <code>fn()</code> <code>fn(1, "abc")</code>
  函数引用: <code>fn</code>
  计算: <code>a+b+1 &gt; 0</code>
  更多 js 语法可参考 <a :href='wikiurl' target='_blank'>wiki</a>.
  
  <a-button @click='drawerClose' size='small'>关闭</a-button>
</pre>

  </a-drawer>
</template>

<script>
export default {
  data() {
    return {
      visible : true,
      wikiurl : xv.ctx_prefix + "/face/web/wiki-api/index.html#docs/javascript-doc.htm",
    };
  },
  
  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    },
    
    drawerClose() {
      this.visible = false;
    },
    
    afterVisibleChange() {
      if (!this.visible) {
        this.$emit('close');
      }
    },
  },
}
</script>

<style scoped>
</style>