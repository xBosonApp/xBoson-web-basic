<!-- Create By xBoson System -->
<template><doc>


<h2>嵌入(Responsive Embeds)</h2>
<demo :x='x'><a v-pre><div>
  <b-embed
    type="iframe"
    aspect="16by9"
    src="https://www.bilibili.com/"
    allowfullscreen
  ></b-embed>
</div>
</a></demo>

<h3>嵌入类型</h3>

<p>{{x.t}}</p>
<p>
通过 type 属性设置您想要的嵌入类型，
</p>
  
</doc></template>

<script>
let x = {
  t: "支持的嵌入类型为 iframe（默认），video（视频），embed（嵌入）和 object（对象），它们可以转换为标准 HTML <iframe> ，<video> ，<embed> 和 <object> 元素。",
};
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>