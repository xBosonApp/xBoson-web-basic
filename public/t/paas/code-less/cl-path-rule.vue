<!-- Create By xBoson System -->

<template>
  <a-drawer
    :title="title"
    :visible="value"
    placement="right"
    width='400'
    @close="$emit('input', false)"
  >
    <p>
      <slot></slot>
    </p>
    <p>
      路径规则:
      <ul>
        <li>以 'cdn/' 开头的路径, 以 cdn 为根目录加载文件</li>
        <li>以 'xui://' 为协议时, 自动添加 '/t' '/ui' 前缀, 并且限定范围在该目录下. </li>
        <li>以 '/' 开头的路径, 在 uifs 范围内寻找文件. </li>
        <li>以 'http://' 或 'https://' 开始的路径加载外部文件 </li>
        <li>以 './' 开头的路径加载低代码平台中的文件 </li>
      </ul>
    </p>
  </a-drawer>
</template>

<script>
export default {
  // 绑定 v-model 用于控制显示
  props: ['title', 'value'],
}
</script>

<style scoped>
</style>