<!-- Create By xBoson System -->

<template><doc>
  <h2>Progress 进度条</h2>
  <demo-layout>
    <div v-pre>
<el-progress :percentage="50"></el-progress>
<el-progress :percentage="100" ></el-progress>
<el-progress :percentage="100" status="success"></el-progress>
<el-progress :percentage="100" status="warning"></el-progress>
<el-progress :percentage="50" status="exception"></el-progress>
    </div>
  </demo-layout>
  
  <h2>百分比内显</h2>
  <demo-layout>
    <div v-pre>
<el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
<el-progress :text-inside="true" :stroke-width="24" :percentage="100" status="success"></el-progress>
<el-progress :text-inside="true" :stroke-width="22" :percentage="80" status="warning"></el-progress>
<el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception"></el-progress>
    </div>
  </demo-layout>
  
  <h2>环形进度条</h2>
  <demo-layout>
    <div v-pre>
<el-progress type="circle" :percentage="0"></el-progress>
<el-progress type="circle" :percentage="25"></el-progress>
<el-progress type="circle" :percentage="100" status="success"></el-progress>
<el-progress type="circle" :percentage="70" status="warning"></el-progress>
<el-progress type="circle" :percentage="50" status="exception"></el-progress>
    </div>
  </demo-layout>
  
</doc></template>

<script>
export default {
}
</script>

<style>
</style>