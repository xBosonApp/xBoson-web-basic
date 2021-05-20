<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>DatePicker 日期选择器</h2>
    
    <h3>选择日</h3>
    <p>以「日」为基本单位，基础的日期选择控件</p>
    <demo-layout :x='x'>
      <div v-pre>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">带快捷选项</span>
    <el-date-picker
      v-model="value2"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
      </div>
    </demo-layout>
    
    <h3>其他日期单位</h3>
    <demo-layout :x='x'>
      <div v-pre>
<div class="container">
  <div class="block">
    <span class="demonstration">周</span>
    <el-date-picker
      v-model="value1"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择周">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">月</span>
    <el-date-picker
      v-model="value2"
      type="month"
      placeholder="选择月">
    </el-date-picker>
  </div>
</div>
<div class="container">
  <div class="block">
    <span class="demonstration">年</span>
    <el-date-picker
      v-model="value3"
      type="year"
      placeholder="选择年">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">多个日期</span>
    <el-date-picker
      type="dates"
      v-model="value4"
      placeholder="选择一个或多个日期">
    </el-date-picker>
  </div>
</div>
      </div>
    </demo-layout>
    
    <h3>选择日期范围</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">带快捷选项</span>
    <el-date-picker
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2">
    </el-date-picker>
  </div>
      </div>
    </demo-layout>
    
    <h3>选择月份范围</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
      v-model="value1"
      type="monthrange"
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">带快捷选项</span>
    <el-date-picker
      v-model="value2"
      type="monthrange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      :picker-options="pickerOptions2">
    </el-date-picker>
  </div>
      </div>
    </demo-layout>
    
    <h3>日期格式</h3>
    <p>
      使用format指定输入框的格式；使用value-format指定绑定值的格式。<br/>

默认情况下，组件接受并返回Date对象。以下为可用的格式化字串，以 UTC 2017年1月2日 03:04:05 为例：
    </p>
    <div class='code-block' style='padding: 20px;'>
    <table class='ftable'><thead><tr><th>格式</th><th>含义</th><th>备注</th><th>举例</th></tr></thead><tbody><tr><td><code>yyyy</code></td><td>年</td><td></td><td>2017</td></tr><tr><td><code>M</code></td><td>月</td><td>不补0</td><td>1</td></tr><tr><td><code>MM</code></td><td>月</td><td></td><td>01</td></tr><tr><td><code>W</code></td><td>周</td><td>仅周选择器的 <code>format</code> 可用；不补0</td><td>1</td></tr><tr><td><code>WW</code></td><td>周</td><td>仅周选择器的 <code>format</code> 可用</td><td>01</td></tr><tr><td><code>d</code></td><td>日</td><td>不补0</td><td>2</td></tr><tr><td><code>dd</code></td><td>日</td><td></td><td>02</td></tr><tr><td><code>H</code></td><td>小时</td><td>24小时制；不补0</td><td>3</td></tr><tr><td><code>HH</code></td><td>小时</td><td>24小时制</td><td>03</td></tr><tr><td><code>h</code></td><td>小时</td><td>12小时制，须和 <code>A</code> 或 <code>a</code> 使用；不补0</td><td>3</td></tr><tr><td><code>hh</code></td><td>小时</td><td>12小时制，须和 <code>A</code> 或 <code>a</code> 使用</td><td>03</td></tr><tr><td><code>m</code></td><td>分钟</td><td>不补0</td><td>4</td></tr><tr><td><code>mm</code></td><td>分钟</td><td></td><td>04</td></tr><tr><td><code>s</code></td><td>秒</td><td>不补0</td><td>5</td></tr><tr><td><code>ss</code></td><td>秒</td><td></td><td>05</td></tr><tr><td><code>A</code></td><td>AM/PM</td><td>仅 <code>format</code> 可用，大写</td><td>AM</td></tr><tr><td><code>a</code></td><td>am/pm</td><td>仅 <code>format</code> 可用，小写</td><td>am</td></tr><tr><td><code>timestamp</code></td><td>JS时间戳</td><td>仅 <code>value-format</code> 可用；组件绑定值为<code>number</code>类型</td><td>1483326245000</td></tr><tr><td><code>[MM]</code></td><td>不需要格式化字符</td><td>使用方括号标识不需要格式化的字符 (如  [A] [MM])</td><td>MM</td></tr></tbody></table>
    </div>
    <demo-layout :x='x'>
      <div v-pre>
  <div class="block">
    <span class="demonstration">默认为 Date 对象</span>
    <div class="demonstration">值：{{ value1 }}</div>
    <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">使用 value-format</span>
    <div class="demonstration">值：{{ value2 }}</div>
    <el-date-picker
      v-model="value2"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">时间戳</span>
    <div class="demonstration">值：{{ value3 }}</div>
    <el-date-picker
      v-model="value3"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
  </div>
      </div>
    </demo-layout>
    
    
    <h3>默认显示日期</h3> 
    <p>选择日期范围时，默认情况下，起始日期和结束日期的时间部分均为当天的 0 点 0 分 0 秒。通过default-time可以分别指定二者的具体时刻。default-time接受一个数组，其中的值为形如12:00:00的字符串，第一个值控制起始日期的时刻，第二个值控制结束日期的时刻。</p>
    <demo-layout :x='x'> 
      <div v-pre>
  <div class="block">
    <p>组件值：{{ value }}</p>
    <el-date-picker
      v-model="value"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']">
    </el-date-picker>
  </div>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
export default {
  data() {
    return {
      x : {
        data : {
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          },
          value1: '',
          value2: '',
          value3: '',
          value4: '',
          value:'',
          
          pickerOptions2: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
        }
      }
    }
  }
}
</script>

<style>
</style>