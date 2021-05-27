<!-- Create By xBoson System -->

<template>
  <dv-full-screen-container>
    <rowrow border='1'>
      <center><h3>机电设备电子档案</h3></center>
      <rowcol style='height:100%'>
        <colrow style='flex:1; padding-right: 10px'>
          <dv-border-box-6>
            <h3>中子收费站</h3>
            <colrow style='height: 95%'>
              <div>设备运行总数 <span class='count'>420</span></div>
              <div style='flex:1'>
                <v-chart :option="d1" autoresize theme='dark'/>
              </div>
              
              <dv-decoration-2 style="width:100%;height:5px;" />
              <div>天空收费站</div>
              <div>设备运行总数 <span class='count'>300</span></div>
              <div style='flex:1'>
                <v-chart :option="dd2()" autoresize theme='dark'/>
              </div>
              
              <dv-decoration-2 style="width:100%;height:5px;" />
              <div>火星收费站</div>
              <div>设备运行总数 <span class='count'>100</span></div>
              <div style='flex:1'>
                <v-chart :option="dd1()" autoresize theme='dark'/>
              </div> 
              
            </colrow>
          </dv-border-box-6>
        </colrow>
        
        <colrow style='flex:4'>
          <rowcol style='flex:2'>
            <colrow style='flex:2'>
              <dv-border-box-6>
                <rowrow style='height:100%'>
                  <colcol>
                    <dv-decoration-1 style="width:200px;height:50px;" />
                    <center style='flex:1'><h3>机电设备总数</h3></center>
                    <dv-decoration-1 style="width:200px;height:50px;" />
                  </colcol>
                  <div style='font-size: 50px'><center>
                    设备总数 <span style='color: #3399ff'>2791</span>
                  </center></div>
                  <div style='height:80%'>
                    <v-chart :option="d3()" autoresize theme='dark'/>
                  </div>
                </rowrow>
              </dv-border-box-6>
            </colrow>
            
            <colrow style='padding-left: 10px'>
              <colrow><dv-border-box-6>
                <colcol>
                  <colrow>
                    <h4>A收费站</h4>
                    <div class='count ccount'>100</div>
                    <div>设备运行总数</div>
                  </colrow>
                  <colcol style='flex:2'>
                    <v-chart :option="d1" autoresize theme='dark'/>
                  </colcol>
                </colcol>
              </dv-border-box-6></colrow>
              
              <colrow><dv-border-box-6>
                <colcol>
                  <colrow>
                    <h4>B收费站</h4>
                    <div class='count ccount'>100</div>
                    <div>设备运行总数</div>
                  </colrow>
                  <colcol style='flex:2'>
                    <v-chart :option="d3()" autoresize theme='dark'/>
                  </colcol>
                </colcol>
              </dv-border-box-6></colrow>
            </colrow>
          </rowcol>
          
          <rowcol style='padding-top: 10px'>
            <colrow><dv-border-box-8>
              <center><h4>X 收费站</h4></center>
              <div style='height:90%'>
                <v-chart :option="dd2()" autoresize theme='dark'/>
              </div>
            </dv-border-box-8></colrow>
            
            <colrow><dv-border-box-8>
              <center><h4>X 收费站</h4></center>
              <div style='height:90%'>
                <v-chart :option="dd2()" autoresize theme='dark'/>
              </div>
            </dv-border-box-8></colrow> 
            
            <colrow><dv-border-box-8>
              <center><h4>X 收费站</h4></center>
              <div style='height:90%'>
                <v-chart :option="dd2()" autoresize theme='dark'/>
              </div>
            </dv-border-box-8></colrow>
            
            <colrow><dv-border-box-8>
              <center><h4>X 收费站</h4></center>
              <div style='height:90%'>
                <v-chart :option="dd2()" autoresize theme='dark'/>
              </div>
            </dv-border-box-8></colrow>
          </rowcol>
        </colrow>
      </rowcol>
    </rowrow>
  </dv-full-screen-container>
</template>

<script>
function rr() {
  return parseInt(Math.random() * 100);
}
function d1() {
  let d = [];
  for (let i=0; i<5; ++i) {
    d[i] = rr();
  }
  return {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['收费系统', '通信系统', '监控系统', '供电系统', '其他']
    },
    series: [
        {
            type: 'bar',
            data: d,
        },
    ]
  };
}

function d2() {
  return {
      legend: {
          top: 'bottom'
      },
      toolbox: {
          show: true,
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      series: [
          {
              type: 'pie',
              radius: [20, 90],
              roseType: 'area',
              itemStyle: {
                  borderRadius: 8
              },
              data: [
                  {value: rr(), name: '收费系统'},
                  {value: rr(), name: '通信系统'},
                  {value: rr(), name: '监控系统'},
                  {value: rr(), name: '供电系统'},
                  {value: rr(), name: '其他'},
              ]
          }
      ]
  };
}

function d3() {
   return {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: '类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: rr(), name: '收费系统'},
                  {value: rr(), name: '通信系统'},
                  {value: rr(), name: '监控系统'},
                  {value: rr(), name: '供电系统'},
                  {value: rr(), name: '其他'},
            ]
        }
    ]
};
}

export default {
  data() {
    return {
      d1 : d1(),
      d2 : d2(),
    }
  },
  methods : {
    dd2() {
      return d2();
    },
    dd1() {
      return d1();
    },
    d3,
  },
}
</script>

<style scoped>
.count {
  color:blue; font-size:30px; margin-left: 10px;
}
.ccount {
  margin: 20px 20px;
}
</style>