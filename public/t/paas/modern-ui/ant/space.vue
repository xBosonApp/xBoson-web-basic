<!-- Create By xBoson System -->

<template><doc>
  <h2>Space 间距</h2>
  <demo >
    <template v-pre>
  <a-space>
    Space
    <a-button type="primary">Button</a-button>
    <a-upload>
      <a-button> <a-icon type="upload" /> Click to Upload </a-button>
    </a-upload>
    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a-button>Confirm</a-button>
    </a-popconfirm>
  </a-space>
</template>
  </demo>
  
  <h3>间距大小 </h3>
  <demo :x='x'>
  <div v-pre>
    <a-radio-group v-model="size">
      <a-radio value="small">Small</a-radio>
      <a-radio value="middle">Middle</a-radio>
      <a-radio value="large">Large</a-radio>
    </a-radio-group>
    <br />
    <br />
    <a-space :size="size">
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="link">Link</a-button>
    </a-space>
  </div>
  </demo>
  
  <h3>垂直间距</h3>
  <demo :x='x'>
    <template v-pre>
  <a-space direction="vertical">
    <a-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
    <a-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
  </a-space>
</template>
  </demo>
  
  <h3>对齐 </h3>
  <demo>
<template v-pre>
  <div class="space-align-container">
    <div class="space-align-block">
      <a-space align="center">
        center
        <a-button type="primary">Primary</a-button>
        <span class="mock-block">Block</span>
      </a-space>
    </div>
    <div class="space-align-block">
      <a-space align="start">
        start
        <a-button type="primary">Primary</a-button>
        <span class="mock-block">Block</span>
      </a-space>
    </div>
    <div class="space-align-block">
      <a-space align="end">
        end
        <a-button type="primary">Primary</a-button>
        <span class="mock-block">Block</span>
      </a-space>
    </div>
    <div class="space-align-block">
      <a-space align="baseline">
        baseline
        <a-button type="primary">Primary</a-button>
        <span class="mock-block">Block</span>
      </a-space>
    </div>
  </div>
</template>
  </demo>
</doc></template>

<script>
export default {
  data() {
    return {
      x:{
        data:{
          size: 'small',
        }
      }
    }
  }
}
</script>

<style>
.space-align-container {
  display: flex;
  align-item: flex-start;
  flex-wrap: wrap;
}
.space-align-block {
  margin: 8px 4px;
  border: 1px solid #40a9ff;
  padding: 4px;
  flex: none;
}
.space-align-block .mock-block {
  display: inline-block;
  padding: 32px 8px 16px;
  background: rgba(150, 150, 150, 0.2);
}
</style>