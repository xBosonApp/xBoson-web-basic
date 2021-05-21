<!-- Create By xBoson System -->

<template><doc>
  
<h2>Grid 栅格</h2>
<p>24 栅格系统。</p>
<demo><div v-pre>
  <template>
  <div>
    <a-row>
      <a-col :span="12">
        col-12
      </a-col>
      <a-col :span="12">
        col-12
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        col-8
      </a-col>
      <a-col :span="8">
        col-8
      </a-col>
      <a-col :span="8">
        col-8
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        col-6
      </a-col>
      <a-col :span="6">
        col-6
      </a-col>
      <a-col :span="6">
        col-6
      </a-col>
      <a-col :span="6">
        col-6
      </a-col>
    </a-row>
  </div>
</template>
</div></demo>

<h3>Flex 对齐</h3>
<demo><div v-pre>
<template>
  <div>
    <p>Align Top</p>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="4">
        <p class="height-100">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">
          col-4
        </p>
      </a-col>
    </a-row>

    <p>Align Center</p>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="4">
        <p class="height-100">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">
          col-4
        </p>
      </a-col>
    </a-row>

    <p>Align Bottom</p>
    <a-row type="flex" justify="space-between" align="bottom">
      <a-col :span="4">
        <p class="height-100">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">
          col-4
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">
          col-4
        </p>
      </a-col>
    </a-row>
  </div>
</template>
</div></demo>

<h3>Flex 排序</h3>
<demo><div v-pre>
  <template>
  <div>
    <a-row type="flex">
      <a-col :span="6" :order="4">
        1 col-order-4
      </a-col>
      <a-col :span="6" :order="3">
        2 col-order-3
      </a-col>
      <a-col :span="6" :order="2">
        3 col-order-2
      </a-col>
      <a-col :span="6" :order="1">
        4 col-order-1
      </a-col>
    </a-row>
  </div>
</template>
</div></demo>

<h3>Flex 布局</h3>
<demo><div v-pre>
  <template>
  <div>
    <p>sub-element align left</p>
    <a-row type="flex" justify="start">
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
    </a-row>

    <p>sub-element align center</p>
    <a-row type="flex" justify="center">
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
    </a-row>

    <p>sub-element align right</p>
    <a-row type="flex" justify="end">
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
    </a-row>

    <p>sub-element monospaced arrangement</p>
    <a-row type="flex" justify="space-between">
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
    </a-row>

    <p>sub-element align full</p>
    <a-row type="flex" justify="space-around">
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
      <a-col :span="4">
        col-4
      </a-col>
    </a-row>
  </div>
</template>
</div></demo>

<h3>Flex 填充</h3>
<demo><div v-pre>
  <template>
  <div>
    <a-divider orientation="left">
      Percentage columns
    </a-divider>
    <a-row type="flex">
      <a-col :flex="2">2 / 5</a-col>
      <a-col :flex="3">3 / 5</a-col>
    </a-row>
    <a-divider orientation="left">
      Fill rest
    </a-divider>
    <a-row type="flex">
      <a-col flex="100px">100px</a-col>
      <a-col flex="auto">auto</a-col>
    </a-row>
    <a-divider orientation="left">
      Raw flex style
    </a-divider>
    <a-row type="flex">
      <a-col flex="1 1 200px">1 1 200px</a-col>
      <a-col flex="0 1 300px">0 1 300px</a-col>
    </a-row>
  </div>
</template>
</div></demo>

<h3>区块间隔</h3>
<demo><div v-pre>
  <template>
  <div class="gutter-example">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          col-6
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          col-6
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          col-6
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          col-6
        </div>
      </a-col>
    </a-row>
  </div>
</template>
</div></demo>
  
</doc></template>

<script>
export default {
}
</script>

<style scoped>
.gutter-example >>> .ant-row > div {
  background: transparent;
  border: 0;
}
.gutter-box {
  background: #00a0e9;
  padding: 5px 0;
}
.ant-col {
  background: #7aa1f9; color: #eee; margin: 3px; text-align: center; padding: 20px 50px;
}
.ant-col * {
  color: #eee;
}
</style>