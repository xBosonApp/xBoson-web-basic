<!-- Create By xBoson System -->

<template><doc>
  <h2>Spin 加载中</h2>
  <demo :x='x'><a v-pre><template>
  <div>
    <a-spin />
  </div>
</template>
</a></demo>
  
  <h3>各种大小</h3>
  <demo :x='x'><a v-pre><template>
  <div>
    <a-spin size="small" />
    <a-spin />
    <a-spin size="large" />
  </div>
</template>
</a></demo>
  
  <h3>容器</h3>
  <demo :x='x'><a v-pre>
<template>
  <div class="example">
    <a-spin />
  </div>
</template>
</a></demo>
  
  <h3>自定义描述文案</h3>
  <demo :x='x'><a v-pre>
<template>
  <div>
    <a-spin tip="Loading...">
      <div class="spin-content">
        我的描述文案是自定义的。。。
      </div>
    </a-spin>
  </div>
</template>
</a></demo>
  
  <h3>延迟 </h3>
  <demo :x='x'><a v-pre>
<template>
  <div>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div class="spin-content">
        可以点击‘切换’按钮，延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示
        loading 状态。
      </div>
    </a-spin>
    Loading state：<a-switch v-model="spinning" />
  </div>
</template>
</a></demo>
  
  <h3>卡片加载中</h3>
  <demo :x='x'><a v-pre>
<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="spin-content">
        可以点击‘切换’按钮，控制本区域的spin展示。
      </div>
    </a-spin>
    Loading state：<a-switch v-model="spinning" />
  </div>
</template>
</a></demo>
  
</doc></template>

<script>
let x = {
  data() {
    return {
      spinning: false,
      delayTime: 500,
    };
  },
  methods: {
    changeSpinning() {
      this.spinning = !this.spinning;
    },
  },
};
export default {
  data() {
    return {x}
  }
}
</script>

<style scoped>
.example {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}

.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>