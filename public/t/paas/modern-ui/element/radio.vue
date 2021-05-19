<!-- Create By xBoson System -->

<template>
  <doc>
    
  <h2>Radio 单选框</h2>
  <h3>基础用法</h3>
  <p>由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。</p>
  <demo-layout>
    <div v-pre>
<template>
  <el-radio v-model="x" label="1">备选项1</el-radio>
  <el-radio v-model="x" label="2">备选项1</el-radio>
</template>
    </div>
  </demo-layout>
  
  <h3>禁用状态</h3>
  <demo-layout>
    <div v-pre>
<template>
  <el-radio disabled v-model="x" label="禁用">备选项</el-radio>
  <el-radio disabled v-model="x" label="选中且禁用">备选项</el-radio>
</template>
    </div>
  </demo-layout>
  
  <h3>单选框组</h3>
  <p>适用于在多个互斥的选项中选择的场景</p>
  <p>结合el-radio-group元素和子元素el-radio可以实现单选组，在el-radio-group中绑定v-model，在el-radio中设置好label即可，无需再给每一个el-radio绑定变量，另外，还提供了change事件来响应变化，它会传入一个参数value。</p>
  <demo-layout>
    <div v-pre>
<el-radio-group v-model="x">
  <el-radio :label="3">备选项</el-radio>
  <el-radio :label="6">备选项</el-radio>
  <el-radio :label="9">备选项</el-radio>
</el-radio-group>
    </div>
  </demo-layout>
  
  <h3>按钮样式</h3>
  <p>只需要把el-radio元素换成el-radio-button元素即可，此外，Element 还提供了size属性。</p>
  <demo-layout>
    <div v-pre>
<template>
  <div>
    <el-radio-group v-model="x">
      <el-radio-button label="上海"></el-radio-button>
      <el-radio-button label="北京"></el-radio-button>
      <el-radio-button label="广州"></el-radio-button>
      <el-radio-button label="深圳"></el-radio-button>
    </el-radio-group>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group v-model="x" size="medium">
      <el-radio-button label="上海" ></el-radio-button>
      <el-radio-button label="北京"></el-radio-button>
      <el-radio-button label="广州"></el-radio-button>
      <el-radio-button label="深圳"></el-radio-button>
    </el-radio-group>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group v-model="x" size="small">
      <el-radio-button label="上海"></el-radio-button>
      <el-radio-button label="北京" disabled ></el-radio-button>
      <el-radio-button label="广州"></el-radio-button>
      <el-radio-button label="深圳"></el-radio-button>
    </el-radio-group>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group v-model="x" disabled size="mini">
      <el-radio-button label="上海"></el-radio-button>
      <el-radio-button label="北京"></el-radio-button>
      <el-radio-button label="广州"></el-radio-button>
      <el-radio-button label="深圳"></el-radio-button>
    </el-radio-group>
  </div>
</template>
    </div>
  </demo-layout>
  
  <h3>带有边框</h3>
  <demo-layout>
    <div v-pre>
<template>
  <div>
    <el-radio v-model="x" label="1" border>备选项1</el-radio>
    <el-radio v-model="x" label="2" border>备选项2</el-radio>
  </div>
  <div style="margin-top: 20px">
    <el-radio v-model="x" label="1" border size="medium">备选项1</el-radio>
    <el-radio v-model="x" label="2" border size="medium">备选项2</el-radio>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group v-model="x" size="small">
      <el-radio label="1" border>备选项1</el-radio>
      <el-radio label="2" border disabled>备选项2</el-radio>
    </el-radio-group>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group v-model="x" size="mini" disabled>
      <el-radio label="1" border>备选项1</el-radio>
      <el-radio label="2" border>备选项2</el-radio>
    </el-radio-group>
  </div>
</template>
    </div>
  </demo-layout>
  </doc>
</template>

<script>
export default {
}
</script>

<style>
</style>