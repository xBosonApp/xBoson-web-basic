<!-- Create By xBoson System -->

<template>
<div>
  <!--<dv-full-screen-container>-->
    <!--<xtitle class='t'/>-->
    <div class='f' ref='th'></div>

    <!--报警信息-->
    <div style='width:230px;height:90%;position:absolute;margin-left:10px;' class='t'>
    <div class="head">
      <p class="line-title" style='padding:6px 0;display:flex;align-items:center;'>
        <img src="./assets/img/warning.svg" height="20px"/>
        <span>报警统计</span>
      </p>
    </div>

      <dialog-data title=''>
        <div style='text-align:right;padding-right:30px'><b ref='dom1'></b></div>
        <!--<x>动车时方式方向手柄</x>-->
        <x>列车丢失位置</x>
        <!--<x>驾驶模式</x>-->
        <x>列车超速</x>
        <!--<x>列车在站台</x>-->
        <!--<x>信号与车辆</x>-->
        <!--<x>受电弓落下</x>-->
        <!--<x>集电靴落下</x>-->
        <!--<x>集电靴抬起</x>-->
        <!--<x>列车出现倒溜</x>-->
        <!--<x>列车冲过站台</x>-->
        <!--<x>WSU人工唤醒</x>-->
        <!--<x>司机确认站台</x>-->
        <x>连续丢失两个定位应答器</x>
        <x>车辆蓄电池组欠压状态</x>
        <x>车辆空气压缩机故障</x>
        <x>车辆牵引控制单元被隔离或锁闭</x>
        <x>车门控制单元被隔离</x>
        <x>车门控制单元探测到障碍物</x>
        <x>乘客紧急拉手被拉下</x>
        <x>车辆烟火报警系统故障</x>
        <x>高压火灾报警</x>
        <x>客室火灾烟雾报警</x>
        <!--<x>车辆视频安防系统清客完成</x>-->
        <x>ATP唤醒自检过程中WSU通信超时</x>
        <x>OFF模式下列车非静止</x>
      </dialog-data>
    </div>


<div style='width:230px;height:90%;position:absolute;margin-left:500px;'>
  <dv-active-ring-chart :config="c1" style="width:100%;height:230px;z-index:99;background-color:rgba(14,30,74,0.7)"/>
</div>


  <!--车辆速度-->
  <div class="pro chart" style="z-index:99;position:absolute;width:240px;right:10px;font-size:12px;">
    <div class="head">
      <p class="line-title" style='padding:6px 0;display:flex;align-items:center;'>
        <svg t="1630726641282" class="svg-img" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5177" width="17" height="17"><path d="M280.392735 768.347418c-44.719432 0-81.102833-35.854527-81.102833-79.926111s36.382402-79.926111 81.102833-79.926112 81.102833 35.854527 81.102833 79.926112-36.382402 79.926111-81.102833 79.926111z m0-113.863091c-19.361424 0-35.113702 15.224402-35.113701 33.93698s15.751278 33.93698 35.113701 33.936979 35.113702-15.224402 35.113702-33.936979-15.751278-33.93698-35.113702-33.93698zM753.376956 768.347418c-44.719432 0-81.102833-35.854527-81.102833-79.926111s36.383402-79.926111 81.102833-79.926112 81.101833 35.854527 81.101833 79.926112-36.382402 79.926111-81.101833 79.926111z m0-113.863091c-19.361424 0-35.113702 15.224402-35.113702 33.93698s15.752277 33.93698 35.113702 33.936979 35.112702-15.224402 35.112702-33.936979-15.751278-33.93698-35.112702-33.93698z" fill="#4285F4" p-id="5178"></path><path d="M778.390045 837.05818H251.411584c-78.970337 0-143.217154-63.155075-143.217153-140.783729v-475.087724c0-56.452659 28.065367-133.654414 161.76677-180.852259C368.495914 5.551688 475.066728 3.790104 495.429916 3.790104c2.24247 0 4.385963 0.014996 6.439478 0.04499 1.14273-0.024994 4.10303-0.077982 8.574974-0.077982 28.64723 0 129.356429 2.266464 222.510414 31.425573 54.317163 17.002982 97.66292 40.466437 128.831554 69.737519 39.693619 37.27819 59.820863 83.661228 59.820862 137.86142v453.492827c0 77.628654-64.246817 140.783729-143.217153 140.783729zM495.429916 49.779236c-52.618565 0-139.231096 8.8839-210.160333 33.922983-86.982444 30.705743-131.086021 76.961812-131.086021 137.485508v475.086724c0 52.269647 43.616692 94.794597 97.228022 94.794597h526.978461c53.61133 0 97.228022-42.52495 97.228022-94.794597v-453.492827c0-76.144005-52.621564-131.222988-156.402038-163.710311-86.927457-27.210569-181.773042-29.326069-208.771661-29.326069-5.019814 0-7.832149 0.072983-7.860143 0.072983l-0.479886 0.012996-0.489885-0.006998a405.704121 405.704121 0 0 0-6.184538-0.044989z" fill="#4285F4" p-id="5179"></path><path d="M782.282125 477.799083H247.519504c-28.763202 0-52.163672-23.52544-52.163672-52.442607v-151.164275c0-28.916166 23.40047-52.442606 52.163672-52.442607h534.762621c28.763202 0 52.163672 23.52544 52.163672 52.442607v151.164275c-0.001 28.916166-23.40147 52.442606-52.163672 52.442607zM247.519504 267.739726c-3.404195 0-6.174541 2.895316-6.174541 6.453474v151.164276c0 3.558159 2.770345 6.453475 6.174541 6.453475h534.762621c3.404195 0 6.174541-2.895316 6.174541-6.453475v-151.164276c0-3.558159-2.770345-6.453475-6.174541-6.453474H247.519504zM262.995847 1024h-0.08698l-127.085966-0.478887a22.994566 22.994566 0 0 1-18.982514-35.844529l124.444591-184.661359a22.993566 22.993566 0 0 1 19.068493-10.143603h511.921019a22.996565 22.996565 0 0 1 19.206461 10.351554l121.617258 184.737341a22.993566 22.993566 0 0 1-19.206461 35.638578H768.504381a22.992566 22.992566 0 0 1-20.198227-12.004163L717.225499 954.474431H313.509909l-30.17287 57.253469a22.994566 22.994566 0 0 1-20.341192 12.2721z m-83.971156-46.306057l70.124428 0.264938 30.144876-57.200482a22.994566 22.994566 0 0 1 20.342193-12.274099h431.256082a22.994566 22.994566 0 0 1 20.198226 12.004163l31.080655 57.120501h69.052681l-91.341414-138.74821H272.58658l-93.561889 138.833189z" fill="#4285F4" p-id="5180"></path><path d="M709.425343 905.365037h-0.059986l-388.733131-0.999764a22.994566 22.994566 0 0 1-20.176232-33.916984l30.372822-56.268703c6.032574-11.176359 19.982278-15.347373 31.157636-9.311799 11.175359 6.031575 15.344374 19.981278 9.3118 31.156637l-12.119136 22.450694 316.053308 0.812808L664.863874 833.752961c-4.777871-11.767219 0.88679-25.179049 12.65301-29.955921 11.76322-4.78087 25.17805 0.885791 29.95692 12.65301l23.254504 57.268466a22.991566 22.991566 0 0 1-2.246469 21.516915 22.990567 22.990567 0 0 1-19.056496 10.129606zM665.275777 213.712494H350.684123c-29.218095 0-52.987478-23.770382-52.987477-52.987478v-13.996692c0-29.217095 23.769383-52.987478 52.987477-52.987478h314.591654c29.218095 0 52.987478 23.770382 52.987477 52.987478v13.996692c0 29.217095-23.770382 52.987478-52.987477 52.987478z m-314.591654-73.982516c-3.859088 0-6.998346 3.139258-6.998346 6.998346v13.996692c0 3.859088 3.139258 6.998346 6.998346 6.998346h314.591654c3.858088 0 6.998346-3.139258 6.998346-6.998346v-13.996692c0-3.859088-3.140258-6.998346-6.998346-6.998346H350.684123z" fill="#4285F4" p-id="5181"></path></svg>
        <span>车辆运行速度</span>
      </p>
    </div>
    <div class="table-box">
      <tao-table ref="tables" :data="tableData" :showPage="false" :hideScrollBar="true" headBg="">
        <el-table-column prop="title" label="车号" width="60px"/>
        <el-table-column label="速度（km/h）" width="180px">
          <template slot-scope="scope">
            <el-progress :format="format" :percentage="scope.row.pro" :color="scope.row.color"/>
          </template>
        </el-table-column>
      </tao-table>
    </div>
  </div>

  <!--车辆状态-->
  <div class="pro chart" style="width:240px;height:100%;position:absolute;right:10px;top:410px">
    <div class="table-box">
      <b ref='dom2'></b>
      <el-carousel height="436px" >
        <el-carousel-item v-for="i in item" :key="item">
          <tao-table ref="tables" :data="i.tbdata" :showPage="false" :hideScrollBar="true" headBg="">
            <el-table-column prop="name" :label="i.label"/>
            <el-table-column prop="value" label="" width="60px"/>
          </tao-table>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

    <!--</div>-->
  <!--</dv-full-screen-container>-->
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  data() {
    return {
      stop: false,
        tableData: [
          {
            title: '1号车',
            percentage: 100.56,
            color: '#f56c6c !important'
          },
          {
            title: '2号车',
            percentage: 72.33,
            color: '#FFC069 !important'
          },
          {
            title: '3号车',
            percentage: 60.67,
            color: '#95DE64 !important'
          },
          {
            title: '4号车',
            percentage: 89.72,
            color: '#e6a23c !important'
          },
          {
            title: '5号车',
            percentage: 50.32,
            color: '#69C0FF !important'
          }
        ],

        item: [
          {
            label:'1号车状态',
            tbdata: [
              {name:'总体', value:'正常1'},
              {name:'网压', value:'正常1'},
              {name:'OBC', value:'正常1'},
              {name:'辅助', value:'正常1'},
              {name:'制动', value:'正常1'},
              {name:'通信', value:'正常1'},
              {name:'车门', value:'正常1'},
              {name:'空调', value:'正常1'},
              {name:'旁路', value:'正常1'},
            ]
          },
          {
            label:'2号车状态',
            tbdata: [
              {name:'总体', value:'正常2'},
              {name:'网压', value:'正常2'},
              {name:'OBC', value:'正常2'},
              {name:'辅助', value:'正常2'},
              {name:'制动', value:'正常2'},
              {name:'通信', value:'正常2'},
              {name:'车门', value:'正常2'},
              {name:'空调', value:'正常2'},
              {name:'旁路', value:'正常2'},
            ]
          },
          {
            label:'3号车状态',
            tbdata: [
              {name:'总体', value:'正常3'},
              {name:'网压', value:'正常3'},
              {name:'OBC', value:'正常3'},
              {name:'辅助', value:'正常3'},
              {name:'制动', value:'正常3'},
              {name:'通信', value:'正常3'},
              {name:'车门', value:'正常3'},
              {name:'空调', value:'正常3'},
              {name:'旁路', value:'正常3'},
            ]
          },
          {
            label:'4号车状态',
            tbdata: [
              {name:'总体', value:'正常4'},
              {name:'网压', value:'正常4'},
              {name:'OBC', value:'正常4'},
              {name:'辅助', value:'正常4'},
              {name:'制动', value:'正常4'},
              {name:'通信', value:'正常4'},
              {name:'车门', value:'正常4'},
              {name:'空调', value:'正常4'},
              {name:'旁路', value:'正常4'},
            ]
          },
          {
            label:'5号车状态',
            tbdata: [
              {name:'总体', value:'正常5'},
              {name:'网压', value:'正常5'},
              {name:'OBC', value:'正常5'},
              {name:'辅助', value:'正常5'},
              {name:'制动', value:'正常5'},
              {name:'通信', value:'正常5'},
              {name:'车门', value:'正常5'},
              {name:'空调', value:'正常5'},
              {name:'旁路', value:'正常5'},
            ]
          }
        ],

      c1: { 
        data: [
          {
            name: '一号车',
            value: 99
          },
          {
            name: '二号车',
            value: 98
          },
          {
            name: '三号车',
            value: 78
          },
          {
            name: '四号车',
            value: 66
          },
          {
            name: '五号车',
            value: 80
          }
        ]
      }
    };
  },
  
  components: {
    x: require('./process.vue', 1,1),
  },
  
  mounted() {
    this.loadModel();
    this.addAnimation();
  },
  
  beforeDestroy() {
    this.stop = true;
  },
  
  methods: {
    async loadModel() {
      const vm = this;
      let THREE = await tool.getTHREE('/loader/DRACOLoader.js', 
          '/loader/GLTFLoader.js', '/controls/OrbitControls.js');
      // console.log("Three", THREE);
      
			let scene = new THREE.Scene();
		// 	scene.background = new THREE.Color( 0x000034 );
			scene.fog = new THREE.FogExp2( 0x000011, 0.02 );
			
			let floor1 = new THREE.GridHelper( 100, 50, 0xffff00, 0xff00ff );
			let floor2 = new THREE.GridHelper( 100, 50, 0xffff00, 0xff00ff );
			let floor3 = new THREE.GridHelper( 100, 50, 0xffff00, 0xff00ff );
			scene.add( floor1 );
			scene.add( floor2 );
			scene.add( floor3 );
			
      let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.set( -43, 16, 18);
			camera.lookAt( 0, 0, 0 );
			
		  tool.loadModel(scene, '/model/train2.glb', model=>{
		    model.scene.translateX(-15);
        model.scene.translateY(1.9);
		  });
			
			let renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1;
			renderer.outputEncoding = THREE.sRGBEncoding;
			renderer.setClearColor(0x000034, 0.1);
			
			const controls = new THREE.OrbitControls( camera, renderer.domElement );
			controls.enableDamping = true; 
			controls.dampingFactor = 0.05;
			controls.screenSpacePanning = false;
			controls.minDistance = 10;
			controls.maxDistance = 40;
			controls.maxPolarAngle = Math.PI / 2;
			
			let light1;
      setlight(scene);
      
      let line1 = tool.addLine(new THREE.Vector3( -5, 3, 0 ), tool.domToWorld(this.$refs.dom1, camera), scene);
      let line2 = tool.addLine(new THREE.Vector3( 12, 3, 0 ), tool.domToWorld(this.$refs.dom2, camera), scene);
      
			window.addEventListener( 'resize', onWindowResize );
			this.$refs.th.appendChild( renderer.domElement );
			animate();
			
			function setlight(scene) {
  			light1 = new THREE.RectAreaLight( 0xffffff, 10, 20, 20 );
  			light1.position.set( 1, 1, 1 );
  			light1.lookAt( 0, 0, 0 );
  			scene.add( light1 );
  			
  			for (let x=-20; x<30; x+=8) {
    			let p1 = new THREE.PointLight(0xffff33, 5, 10, 2);
    			let p2 = new THREE.PointLight(0xffff33, 5, 10, 2);
    			p1.position.set(x, 10, 3);
    			p2.position.set(x, 10, -3);
    			scene.add(p1);
    			scene.add(p2);
  			}
      }
      
      function animate(t) {
        if (vm.stop) return;
        let l1x = t/10 % 300-200;
        light1.position.set(l1x, 5, 5);
        light1.lookAt( l1x, 5, 5 );
        
        floor1.position.set(t/30 % 100+50, 1, 1);
        floor2.position.set(t/30 % 100-50, 1, 1);
        floor3.position.set(t/30 % 100-100, 1, 1);
        
  			controls.update();
        line1.moveEndTo(tool.domToWorld(vm.$refs.dom1, camera));
        line2.moveEndTo(tool.domToWorld(vm.$refs.dom2, camera));
        
  			render();
  			requestAnimationFrame(animate);
  		  // console.log(camera.position)
  		}
  		
      function onWindowResize() {
  			camera.aspect = window.innerWidth / window.innerHeight;
  			camera.updateProjectionMatrix();
  			renderer.setSize( window.innerWidth, window.innerHeight );
  			render();
  		}
  		
  		function render() {
  		  renderer.render(scene, camera);
  		}
    },

      addAnimation() {
        setTimeout(() => {
          let { tableData } = this
          for(let i=0; i<tableData.length; i++) {
            let item = tableData[i]

            this.$set(this.tableData[i], 'pro', item.percentage)
          }
        }, 1)
      },
      format(percentage) {
        return percentage === 100 ? '超速' : `${percentage}`;
      }
  },
}
</script>

<style scoped>
.f {
  width: 100%; height: 100%; position: fixed; top:0; left:0; z-index:1;
}
.t {
  z-index:2;
}
.cell {
  font-size:12px!important;
}
</style>