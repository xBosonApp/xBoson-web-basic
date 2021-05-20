<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>TimePicker 时间选择器</h2>
    <h3>固定时间点</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-time-select
  v-model="value"
  :picker-options="{
    start: '08:30',
    step: '00:15',
    end: '18:30'
  }"
  placeholder="选择时间">
</el-time-select>
      </div>
    </demo-layout>
    
    <h3>任意时间点</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-time-picker
    v-model="value1"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker>
  <el-time-picker
    arrow-control
    v-model="value2"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker>
      </div>
    </demo-layout>
    
    <h3>固定时间范围</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-time-select
    placeholder="起始时间"
    v-model="startTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }">
  </el-time-select>
  <el-time-select
    placeholder="结束时间"
    v-model="endTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: startTime
    }">
  </el-time-select>
      </div>
    </demo-layout>
    
    <h3>任意时间范围</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-time-picker
    is-range
    v-model="value1s"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
  <el-time-picker
    is-range
    arrow-control
    v-model="value2s"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
      </div>
    </demo-layout>
    
  </doc>
</template>

<script>
export default {
  data() {
    return {
      x : {
        data: {
          value: '',
          value1: new Date(2016, 9, 10, 18, 40),
          value2: new Date(2016, 9, 10, 18, 40),
          startTime: '',
          endTime: '',
          value1s: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
          value2s: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
        }
      }
    }
  }
}
</script>

<style>
</style>