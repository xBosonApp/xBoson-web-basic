<!-- Create By xBoson System -->

<template>
<div>
  <dv-full-screen-container>
    <xtitle class='t'/>
    <div class='f' ref='th'></div>
    
    <div style='width: 300px; height: 90%; margin-left: 10px;' class='t'>
      <dialog-data title='报警统计'>
        <div style='text-align: right; padding-right: 30px'><b ref='dom1'></b></div>
        <x>动车时方式方向手柄</x>
        <x>列车丢失位置</x>
        <x>驾驶模式</x>
        <x>列车超速</x>
        <x>列车在站台</x>
        <x>信号与车辆</x>
        <x>受电弓落下</x>
        <x>集电靴落下</x>
        <x>集电靴抬起</x>
        <x>列车出现倒溜</x>
        <x>列车冲过站台:</x>
        <x>WSU人工唤醒</x>
        <x>司机确认站台</x>
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
        <x>车辆视频安防系统清客完成</x>
        <x>ATP唤醒自检过程中WSU通信超时</x>
        <x>OFF模式下列车非静止</x>
      </dialog-data>
    </div>
    
    <div style='width: 300px; height: 90%; position: absolute; right: 10px; top: 100px' class='t'>
      <dialog-data title='车辆状态'>
        <table ref='dom2'>
          <tr v-for='i in tbdata'>
            <td class='txt'>{{ i.name }}</td> 
            <td class='txt'>{{ i.value }}</td>
          </tr>
        </table>
      </dialog-data>
      
      <dialog-data title='停车偏差'>
        <dv-active-ring-chart :config="c1" 
          style="width:100%;height:270px; background-color: rgba(14,30,74,0.7)" />
      </dialog-data>
      
      <!--<dialog-data>-->
      <!--</dialog-data>-->
    </div>
  </dv-full-screen-container>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  data() {
    return {
      stop: false,
      
      tbdata: [
        {name:'总体', value:'正常'},
        {name:'电压', value:'正常'},
        {name:'制动', value:'正常'},
        {name:'气压', value:'正常'},
        {name:'引擎', value:'正常'},
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
			scene.background = new THREE.Color( 0x000034 );
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
			
			let renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1;
			renderer.outputEncoding = THREE.sRGBEncoding;
			
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
</style>