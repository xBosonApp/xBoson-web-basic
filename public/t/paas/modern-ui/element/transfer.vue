<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Transfer 穿梭框</h2>
    <demo-layout :x='x'>
      <div v-pre>
        <el-transfer v-model="value" :data="data"></el-transfer>
      </div>
    </demo-layout>
    
    <h3>可搜索</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-transfer
    filterable
    :filter-method="filterMethod"
    filter-placeholder="请输入城市拼音"
    v-model="value"
    :data="data2">
  </el-transfer>
      </div>
    </demo-layout>
    
    <h3>可自定义</h3>
    <demo-layout :x='x'>
      <div v-pre>
<p style="text-align: center; margin: 0 0 20px">使用 render-content 自定义数据项</p>
<div style="text-align: center">
  <el-transfer
    style="text-align: left; display: inline-block"
    v-model="value"
    filterable
    :left-default-checked="[2, 3]"
    :right-default-checked="[1]"
    :render-content="renderFunc"
    :titles="['Source', 'Target']"
    :button-texts="['到左边', '到右边']"
    :format="{
      noChecked: '${total}',
      hasChecked: '${checked}/${total}'
    }"
    :data="data">
    <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
    <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
  </el-transfer>
</div>
<p style="text-align: center; margin: 50px 0 20px">使用 scoped-slot 自定义数据项</p>
<div style="text-align: center">
  <el-transfer
    style="text-align: left; display: inline-block"
    v-model="value4"
    filterable
    :left-default-checked="[2, 3]"
    :right-default-checked="[1]"
    :titles="['Source', 'Target']"
    :button-texts="['到左边', '到右边']"
    :format="{
      noChecked: '${total}',
      hasChecked: '${checked}/${total}'
    }"
    :data="data">
    <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
    <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
    <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
  </el-transfer>
</div>
      </div>
    </demo-layout>
    
    <h3>数据项属性别名</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-transfer
  v-model="value"
  :props="{
    key: 'value',
    label: 'desc'
  }"
  :data="data4">
</el-transfer>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
const generateData = _ => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${ i }`,
      disabled: i % 4 === 0
    });
  }
  return data;
};

const generateData2 = _ => {
  const data = [];
  const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
  const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
  cities.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      pinyin: pinyin[index]
    });
  });
  return data;
};

const generateData3 = _ => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${ i }`,
      disabled: i % 4 === 0
    });
  }
  return data;
};

const generateData4 = _ => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      value: i,
      desc: `备选项 ${ i }`,
      disabled: i % 4 === 0
    });
  }
  return data;
};

export default {
  data() {
    return {
      x : {
        data : {
          data : generateData(),
          data2 : generateData2(),
          data3 : generateData3(),
          data4 : generateData4(),
          value: [1, 4],
          value4: [1],
          filterMethod(query, item) {
            return item.pinyin.indexOf(query) > -1;
          },
          renderFunc(h, option) {
            return '<span>'+ ( option.key  -  option.label ) +'</span>';
          },
        },
        methods: {
          handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
          }
        }
      }
    }
  }
}
</script>

<style>
</style>