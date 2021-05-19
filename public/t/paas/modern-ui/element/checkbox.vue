<!-- Create By xBoson System -->

<template>
  <doc>
    
  <h2>Checkbox 多选框</h2>
  <demo-layout>
    <div v-pre>
      <template>
      <el-checkbox v-model="x">备选项</el-checkbox>
      </template>
    </div>
  </demo-layout>
  
  <h3>禁用状态</h3>
  <demo-layout>
    <div v-pre>
<template>
  <el-checkbox v-model="x" disabled>备选项1</el-checkbox>
  <el-checkbox v-model="v" disabled>备选项</el-checkbox>
</template>
    </div>
  </demo-layout>
  
  <h3>多选框组</h3>
  <p>适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。</p>
  <p>checkbox-group元素能把多个 checkbox 管理为一组，只需要在 Group 中使用v-model绑定Array类型的变量即可。 el-checkbox 的 label属性是该 checkbox 对应的值，若该标签中无内容，则该属性也充当 checkbox 按钮后的介绍。label与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。</p>
  <demo-layout>
    <div v-pre>
<el-checkbox-group v-model="a">
  <el-checkbox label="复选框 A"></el-checkbox>
  <el-checkbox label="复选框 B"></el-checkbox>
  <el-checkbox label="复选框 C"></el-checkbox>
  <el-checkbox label="禁用" disabled></el-checkbox>
  <el-checkbox label="选中且禁用" disabled></el-checkbox>
</el-checkbox-group>
    </div>
  </demo-layout>
  
  <h3>可选项目数量的限制</h3>
  <p>使用 min 和 max 属性能够限制可以被勾选的项目的数量。</p>
  <demo-layout>
    <div v-pre>
<el-checkbox-group 
  v-model="a"
  :min="1"
  :max="2">
  <el-checkbox v-for="city in ['上海', '北京', '广州', '深圳']" :label="city" :key="city">{{city}}</el-checkbox>
</el-checkbox-group>
    </div>
  </demo-layout>
  
  <h2>按钮样式</h2>
  <demo-layout>
    <div v-pre>
<div>
  <el-checkbox-group v-model="a">
    <el-checkbox-button v-for="city in  ['上海', '北京', '广州', '深圳']" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="a" size="medium">
    <el-checkbox-button v-for="city in  ['上海', '北京', '广州', '深圳']" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="a" size="small">
    <el-checkbox-button v-for="city in  ['上海', '北京', '广州', '深圳']" :label="city" :disabled="city === '北京'" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="a" size="mini" disabled>
    <el-checkbox-button v-for="city in  ['上海', '北京', '广州', '深圳']" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
    </div>
  </demo-layout>
  
  <h3>带有边框</h3>
  <demo-layout>
    <div v-pre>
<div>
  <el-checkbox v-model="a" label="备选项1" border></el-checkbox>
  <el-checkbox v-model="a" label="备选项2" border></el-checkbox>
</div>
<div style="margin-top: 20px">
  <el-checkbox v-model="a" label="备选项1" border size="medium"></el-checkbox>
  <el-checkbox v-model="a" label="备选项2" border size="medium"></el-checkbox>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="a" size="small">
    <el-checkbox label="备选项1" border></el-checkbox>
    <el-checkbox label="备选项2" border disabled></el-checkbox>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="a" size="mini" disabled>
    <el-checkbox label="备选项1" border></el-checkbox>
    <el-checkbox label="备选项2" border></el-checkbox>
  </el-checkbox-group>
</div>
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