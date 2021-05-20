<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Input 输入框</h2>
    <pre>
      Input 为受控组件，它总会显示 Vue 绑定值。

      通常情况下，应当处理 input 事件，并更新组件的绑定值（或使用v-model）。否则，输入框内显示的值将不会改变。
      
      不支持 v-model 修饰符。
    </pre>
    
    <demo-layout>
      <dir v-pre>
<el-input v-model="s" placeholder="请输入内容"></el-input>
      </dir>
    </demo-layout>
    
    <h3>禁用状态</h3>
    <demo-layout>
      <div v-pre>
<el-input
  placeholder="请输入内容"
  v-model="s"
  :disabled="true">
</el-input>
      </div>
    </demo-layout>
    
    <h3>可清空</h3>
    <demo-layout>
      <div v-pre>
<el-input
  placeholder="请输入内容"
  v-model="s"
  clearable>
</el-input>
      </div>
    </demo-layout>
    
    <h3>密码框</h3>
    <demo-layout>
      <div v-pre>
<el-input placeholder="请输入密码" v-model="s" show-password></el-input>
      </div>
    </demo-layout>
    
    <h3>带 icon 的输入框</h3>
    <demo-layout>
      <div v-pre>
<div class="demo-input-suffix">
  属性方式：
  <el-input
    placeholder="请选择日期"
    suffix-icon="el-icon-date"
    v-model="d">
  </el-input>
  <el-input
    placeholder="请输入内容"
    prefix-icon="el-icon-search"
    v-model="s">
  </el-input>
</div>
<div class="demo-input-suffix">
  slot 方式：
  <el-input
    placeholder="请选择日期"
    v-model="d">
    <i slot="suffix" class="el-input__icon el-icon-date"></i>
  </el-input>
  <el-input
    placeholder="请输入内容"
    v-model="s">
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
  </el-input>
</div>
      </div>
    </demo-layout>
    
    <h3>文本域</h3>
    <demo-layout>
      <div v-pre>
<el-input
  type="textarea"
  :rows="2"
  placeholder="请输入内容"
  v-model="s">
</el-input>
      </div>
    </demo-layout>
    
    <h3>可自适应文本高度的文本域</h3>
    <demo-layout>
      <div v-pre>
<el-input
  type="textarea"
  autosize
  placeholder="请输入内容"
  v-model="s">
</el-input>
<div style="margin: 20px 0;"></div>
<el-input
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 4}"
  placeholder="请输入内容"
  v-model="s">
</el-input>
      </div>
    </demo-layout>
    
    <h3>复合型输入框</h3>
    <demo-layout>
      <div v-pre>
<div>
  <el-input placeholder="请输入内容" v-model="s">
    <div slot="prepend">Http://</div>
  </el-input>
</div>
<div style="margin-top: 15px;">
  <el-input placeholder="请输入内容" v-model="s">
    <div slot="append">.com</div>
  </el-input>
</div>
<div style="margin-top: 15px;">
  <el-input placeholder="请输入内容" v-model="s" class="input-with-select">
    <el-select v-model="a" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
</div>
      </div>
    </demo-layout>
    
    <h3>尺寸</h3>
    <demo-layout>
      <div v-pre>
<div class="demo-input-size">
  <el-input
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="s">
  </el-input>
  <el-input
    size="medium"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="s">
  </el-input>
  <el-input
    size="small"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="s">
  </el-input>
  <el-input
    size="mini"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="s">
  </el-input>
</div>
      </div>
    </demo-layout>
    
    <h3>带输入建议</h3>
    <p>
      autocomplete 是一个可带输入建议的输入框组件，fetch-suggestions 是一个返回输入建议的方法属性，如 querySearch(queryString, cb)，在该方法中你可以在你的输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。
    </p>
    <demo-layout :x='x'>
      <div v-pre>
<el-row class="demo-autocomplete">
  <el-col :span="12">
    <div class="sub-title">激活即列出输入建议</div>
    <el-autocomplete
      class="inline-input"
      v-model="a"
      :fetch-suggestions="f"
      placeholder="请输入内容"
    ></el-autocomplete>
  </el-col>
  <el-col :span="12">
    <div class="sub-title">输入后匹配输入建议</div>
    <el-autocomplete
      class="inline-input"
      v-model="a"
      :fetch-suggestions="f"
      placeholder="请输入内容"
      :trigger-on-focus="false"
    ></el-autocomplete>
  </el-col>
</el-row>
      </div>
    </demo-layout>
    
    <h3>自定义模板 / 远程搜索</h3>
    <p>参考官方文档</p>
    
    <h3>输入长度限制</h3>
    <demo-layout>
      <div v-pre>
<el-input
  type="text"
  placeholder="请输入内容"
  v-model="s"
  maxlength="10"
  show-word-limit
>
</el-input>
<div style="margin: 20px 0;"></div>
<el-input
  type="textarea"
  placeholder="请输入内容"
  v-model="s"
  maxlength="30"
  show-word-limit
>
</el-input>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
export default {
  data() {
    return {
      x: {
        methods: { 
          f(a, cb) {
            cb([{value:"ok1"+ a, x:'hello'}, {value:'ok2'+a, x:'world'}])
          },
        }
      }
    }
  }
}
</script>

<style>
</style>