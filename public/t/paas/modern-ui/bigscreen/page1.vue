<!-- Create By xBoson System -->

<template>
  <dv-full-screen-container>
    <el-row style='height: 80px'>
      <el-col :span="8">
        <dv-decoration-8 style="width:100%;height:50px;" />
      </el-col>
      <el-col :span="8">
        <center><h3>施工养护综合数据</h3></center>
        <dv-decoration-5 style="width:100%;height:40px;"></dv-decoration-5>
      </el-col>
      <el-col :span="8">
        <dv-decoration-8 :reverse="true" style="width:100%;height:50px;" />
      </el-col>
    </el-row>
    
    <el-row style='height: 150px' type='flex' gutter='20'>
      <el-col :span="3"><bs1 title='管养里程' value='27377' unit='公里'/></el-col>
      <el-col :span="3"><bs1 title='桥梁' value='24' unit='座'/></el-col>
      <el-col :span="3"><bs1 title='隧道' value='9' unit='个'/></el-col>
      <el-col :span="3"><bs1 title='匝道' value='14' unit='个'/></el-col>
      
      <el-col :span="3"><bs1 title='服务区' value='5' unit='个'/></el-col>
      <el-col :span="3"><bs1 title='收费站' value='9' unit='个'/></el-col>
      <el-col :span="3"><bs1 title='超限站' value='10' unit='个'/></el-col>
      <el-col :span="3"><bs1 title='停车区' value='10' unit='个'/></el-col>
    </el-row>
    
    <el-row style='flex:1' type='flex' gutter='20'>
      <el-col :span='4'><dv-border-box-7 style=''>
        <h4>巡查上报记录数量</h4>
        <dv-scroll-ranking-board :config="d1" style="width:100%;height:50%"/>
      </dv-border-box-7></el-col>
      
      <el-col :span='20' type='flex'>
        <el-row style='height: 60%' type='flex' gutter='20'>
          <el-col span='9'><dv-border-box-7 class='content'>
            <h4>累计计量资金分布</h4>
            <dv-charts :option="d4"/>
          </dv-border-box-7></el-col>
          
          <el-col span='5'><dv-border-box-7 class='content'>
            <h4>计划资金累计完成情况</h4>
            <div style='margin: 20px 0;'>累计完成 <span style='color: #8d58de; font-size: 25px'>235, 023</span> 元</div>
            <dv-water-level-pond :config="d3" style="width: 100%; height: 60%" />
          </dv-border-box-7></el-col>
          
          <el-col span='10'><dv-border-box-7 class='content'>
            <dv-scroll-board :config="d2" style="width:100%;height:100%" />
          </dv-border-box-7></el-col>
        </el-row>
        
        <el-row style='height: 40%;' type='flex' gutter='20'>
          <el-col :span='4'><bs2 title='测试路段1' index='1' value='9448' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段2' index='2' value='5000' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段3' index='3' value='3021' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段4' index='4' value='449' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段5' index='5' value='6986' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段6' index='6' value='9211' total='18001'/></dv-border-box-7></el-col>
          <el-col :span='4'><bs2 title='测试路段7' index='7' value='7766' total='18001'/></dv-border-box-7></el-col>
        </el-row>
      </el-col>
    </el-row>
    
  </dv-full-screen-container>
</template>

<script>
export default {
  data() {
    return {
      d1: {
        data : [
          { name: '交通事故', value: 120 },
          { name: '计日工', value: 80 },
          { name: '路面', value: 78 },
          { name: '桥通', value: 66 },
          { name: '日常养护', value: 55 },
          { name: '路基', value: 45 },
          { name: '交安设施', value: 29 },
          { name: '除雪', value: 28 },
          { name: '绿化', value: 29 },
        ]
      },
      
      d2: {
        index : true,
        header : ['时间', '病害信息', '数量', '标段'],
        data : [
          ['2019-07-01 10:23:00', '路面-松散', '1'],
          ['2019-07-01 10:23:00', '路面-油污清理', '11'],
          ['2019-07-01 10:23:00', '交通标志牌结构', '5'],
          ['2019-07-01 10:23:00', '路基-防尘网', '29'],
          ['2019-09-11 10:23:00', '路面-松散', '3'],
          ['2019-09-01 10:23:00', '路基-防尘网', '29'],
          ],
      },
      
      d3: {
          data: [55],
          shape: 'round',
      },
      
      d4: {
        series: [
          {
            type: 'pie',
            data: [
              { name: '除雪', value: 93 },
              { name: '计日工', value: 32 },
              { name: '绿化', value: 65 },
              { name: '路面', value: 44 },
              { name: '路基', value: 52 },
              { name: '交安设施', value: 30 },
              { name: '日常养护', value: 11 },
              { name: '路通', value: 4 },
            ],
            insideLabel: {
              show: true
            },
            roseType: true
          }
        ]
      },
    };
  }
}
</script>

<style>
</style>