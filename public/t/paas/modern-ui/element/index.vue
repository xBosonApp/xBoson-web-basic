<template>
  <el-menu  background-color="#796547"
            text-color="#ffffff"
            active-text-color="#ffd04b"
            @select='openPage'>
    <el-menu-item-group title='Basic'>
      <el-menu-item index='layout'>Layout 布局</el-menu-item>
      <el-menu-item index='container'>Container 布局容器</el-menu-item>
      <el-menu-item index='button'>Button 按钮</el-menu-item>
      <el-menu-item index='link'>Link 文字链接</el-menu-item>
    </el-menu-item-group>    
    
    <el-menu-item-group title='Form'>
      <el-menu-item index='radio'>Radio 单选框</el-menu-item>
      <el-menu-item index='checkbox'>Checkbox 多选框</el-menu-item>
      <el-menu-item index='input'></el-menu-item>
      <el-menu-item index='inputNumber'></el-menu-item>
      <el-menu-item index='select'></el-menu-item>
      <el-menu-item index='cascader'></el-menu-item>
      <el-menu-item index='switch'></el-menu-item>
      <el-menu-item index='slider'></el-menu-item>
      <el-menu-item index='timerpicker'></el-menu-item>
      <el-menu-item index='datepicker'></el-menu-item>
      <el-menu-item index='datetimepicker'></el-menu-item>
      <el-menu-item index='upload'></el-menu-item>
      <el-menu-item index='rate'></el-menu-item>
      <el-menu-item index='colorpicker'></el-menu-item>
      <el-menu-item index='transfer'></el-menu-item>
      <el-menu-item index='form'></el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  methods : {
    openPage(id) {
      let path = './'+ id +'.vue';
      let mod = require(path);
      this.$emit("change-content", mod, id);
    }
  }
}
</script>