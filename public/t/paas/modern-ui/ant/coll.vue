<!-- Create By xBoson System -->

<template><doc>
  <h2>Collapse折叠面板</h2>
  <demo :x='x'><a v-pre>
    <template>
  <div>
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3" disabled>
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
  </a></demo>
  
  <h3>手风琴</h3>
  <demo><a v-pre>
    <template>
  <div>
    <a-collapse accordion>
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
  </a></demo>
  
  <h3>面板嵌套</h3>
  <demo><a v-pre>
    <template>
  <div>
    <a-collapse>
      <a-collapse-panel key="1" header="This is panel header 1">
        <a-collapse default-active-key="4">
          <a-collapse-panel key="4" header="This is panel nest panel">
            <p>{{ text }}</p>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

  </a></demo>
  
</doc></template>

<script>
let d = {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1'],
    };
let methods = {
    changeActivekey(key) {
      console.log(key);
    },
  };
    
export default {
  data() {
    return {
      x:{data:d, methods}
    };
  },
}
</script>

<style>
</style>