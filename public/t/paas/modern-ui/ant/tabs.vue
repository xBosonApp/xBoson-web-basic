<!-- Create By xBoson System -->

<template><doc>
  <h2>Tabs 标签页</h2>
  <demo :x='x'><a v-pre>
    <template>
  <div>
    <a-tabs default-active-key="1" >
      <a-tab-pane key="1" tab="Tab 1">
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" force-render>
        Content of Tab Pane 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
        Content of Tab Pane 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
  </a></demo>
  
  <h3>滑动</h3>
  <demo :x='x'><a v-pre>
    <template>
  <div style="width: 500px">
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="top">
        Horizontal
      </a-radio-button>
      <a-radio-button value="left">
        Vertical
      </a-radio-button>
    </a-radio-group>
    <a-tabs
      default-active-key="1"
      :tab-position="mode"
      :style="{ height: '200px' }"
    >
      <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"> Content of tab {{ i }} </a-tab-pane>
    </a-tabs>
  </div>
</template>
  </a></demo>
  
  <h3>大小</h3>
  <demo :x='x'><a v-pre>
    <template>
  <div>
    <a-radio-group v-model="size" style="margin-bottom: 16px">
      <a-radio-button value="small">
        Small
      </a-radio-button>
      <a-radio-button value="default">
        Default
      </a-radio-button>
      <a-radio-button value="large">
        Large
      </a-radio-button>
    </a-radio-group>
    <a-tabs default-active-key="2" :size="size">
      <a-tab-pane key="1" tab="Tab 1">
        Content of tab 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">
        Content of tab 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
        Content of tab 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
  </a></demo>
  
  <h3>新增和关闭页签</h3>
  <demo :x='x'><a v-pre>
    <template>
  <a-tabs v-model="activeKey" type="editable-card" >
    <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
      {{ pane.content }}
    </a-tab-pane>
  </a-tabs>
</template>
  </a></demo>
  
</doc></template>

<script>
let x = {
  data() {
    const panes = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
    ];
    return {
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0,
      mode: 'top',size: 'small',
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add() {
      const panes = this.panes;
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
      this.panes = panes;
      this.activeKey = activeKey;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
  },
}
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