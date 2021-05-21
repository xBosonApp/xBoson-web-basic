<!-- Create By xBoson System -->

<template><doc>
  <h2>Statistic 统计数值</h2>
  <demo><a v-pre>
    <template>
  <div>
    <a-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
    <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
  </div>
</template>
  </a></demo>
  
  <h3>倒计时</h3>
  <demo :x='x'><a v-pre>
    <template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-countdown
        title="Countdown"
        :value="deadline"
        style="margin-right: 50px"
      />
    </a-col>
    <a-col :span="12">
      <a-statistic-countdown
        title="Million Seconds"
        :value="deadline"
        format="HH:mm:ss:SSS"
        style="margin-right: 50px"
      />
    </a-col>
    <a-col :span="24" style="margin-top: 32px;">
      <a-statistic-countdown title="Day Level" :value="deadline" format="D 天 H 时 m 分 s 秒" />
    </a-col>
  </a-row>
</template>
  </a></demo>
  
  <h3>在卡片中使用 </h3>
  <demo :x='x'><a v-pre>
    <template>
  <div style="background: #ECECEC; padding: 30px">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="Feedback"
            :value="11.28"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <a-icon type="arrow-up" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="Idle"
            :value="9.3"
            :precision="2"
            suffix="%"
            class="demo-class"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <a-icon type="arrow-down" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
  </a></demo>
  
</doc></template>

<script>
var x =  {
  data: {
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
  },
  methods: {
    onFinish() {
      console.log('finished!');
    },
  },
};
export default {
  data() {
    return {
      x,
    }
  }
}
</script>

<style>
</style>