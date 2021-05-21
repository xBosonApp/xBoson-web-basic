<!-- Create By xBoson System -->

<template><doc>
  <h2>Descriptions 描述列表</h2>
  <demo :x='x'><a v-pre>
    <template>
  <a-descriptions title="User Info">
    <a-descriptions-item label="UserName">
      Zhou Maomao
    </a-descriptions-item>
    <a-descriptions-item label="Telephone">
      1810000000
    </a-descriptions-item>
    <a-descriptions-item label="Live">
      Hangzhou, Zhejiang
    </a-descriptions-item>
    <a-descriptions-item label="Remark">
      empty
    </a-descriptions-item>
    <a-descriptions-item label="Address">
      No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
    </a-descriptions-item>
  </a-descriptions>
</template>
  </a></demo>
  
  <h3>带边框的</h3>
  <demo :x='x'><a v-pre><template>
  <a-descriptions title="User Info" bordered>
    <a-descriptions-item label="Product">
      Cloud Database
    </a-descriptions-item>
    <a-descriptions-item label="Billing Mode">
      Prepaid
    </a-descriptions-item>
    <a-descriptions-item label="Automatic Renewal">
      YES
    </a-descriptions-item>
    <a-descriptions-item label="Order time">
      2018-04-24 18:00:00
    </a-descriptions-item>
    <a-descriptions-item label="Usage Time" :span="2">
      2019-04-24 18:00:00
    </a-descriptions-item>
    <a-descriptions-item label="Status" :span="3">
      <a-badge status="processing" text="Running" />
    </a-descriptions-item>
    <a-descriptions-item label="Negotiated Amount">
      $80.00
    </a-descriptions-item>
    <a-descriptions-item label="Discount">
      $20.00
    </a-descriptions-item>
    <a-descriptions-item label="Official Receipts">
      $60.00
    </a-descriptions-item>
    <a-descriptions-item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1<br />
    </a-descriptions-item>
  </a-descriptions>
</template>
</a></demo>
  
  <h3>自定义尺寸</h3>
  <demo :x='x'><a v-pre>
  <div>
    <a-radio-group v-model="size" >
      <a-radio value="default">
        default
      </a-radio>
      <a-radio value="middle">
        middle
      </a-radio>
      <a-radio value="small">
        small
      </a-radio>
    </a-radio-group>
    <br />
    <br />
    <a-descriptions bordered title="Custom Size" :size="size">
      <a-descriptions-item label="Product">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="Billing">
        Prepaid
      </a-descriptions-item>
      <a-descriptions-item label="Time">
        18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="Amount">
        $80.00
      </a-descriptions-item>
      <a-descriptions-item label="Discount">
        $20.00
      </a-descriptions-item>
      <a-descriptions-item label="Official">
        $60.00
      </a-descriptions-item>
      <a-descriptions-item label="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1<br />
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <br />
    <a-descriptions title="Custom Size" :size="size">
      <a-descriptions-item label="Product">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="Billing">
        Prepaid
      </a-descriptions-item>
      <a-descriptions-item label="Time">
        18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="Amount">
        $80.00
      </a-descriptions-item>
      <a-descriptions-item label="Discount">
        $20.00
      </a-descriptions-item>
      <a-descriptions-item label="Official">
        $60.00
      </a-descriptions-item>
    </a-descriptions>
  </div>
</a></demo>
  
  <h3>响应式</h3>
  <demo :x='x'><a v-pre>
  <div>
    <a-descriptions
      title="Responsive Descriptions"
      bordered
      :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
    >
      <a-descriptions-item label="Product">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="Billing">
        Prepaid
      </a-descriptions-item>
      <a-descriptions-item label="Time">
        18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="Amount">
        $80.00
      </a-descriptions-item>
      <a-descriptions-item label="Discount">
        $20.00
      </a-descriptions-item>
      <a-descriptions-item label="Official">
        $60.00
      </a-descriptions-item>
      <a-descriptions-item label="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
      </a-descriptions-item>
    </a-descriptions>
  </div>
</a></demo>
  
</doc></template>

<script>
export default {
  data() {
    return {
      x:{
        data:{
          size:"default"
        }
      }
    }
  }
}
</script>

<style>
</style>