<!-- Create By xBoson System -->

<template>
<div>
  <dv-full-screen-container>
    <xtitle class='t'/>
    <div class='f' ref='th'></div>
    
    <div style='width: 300px; height: 90%; margin-left: 10px' class='t'>
      <dialog-data title='停车偏差'>
        <dv-active-ring-chart :config="c1" style="width:100%;height:270px; background-color: rgba(14,30,74,0.7)" />
      </dialog-data>
    </div>
    
    <div style='width: 300px; height: 90%; position: absolute; right: 10px; top: 100px' class='t'>
      <dialog-data title='车辆状态'>
        <table>
          <tr>
            <td>总体</td> <td>正常</td>
          </tr>
          <tr>
            <td>电压</td> <td>正常</td>
          </tr>
          <tr>
            <td>刹车</td> <td>正常</td>
          </tr>
          <tr>
            <td>气压</td> <td>正常</td>
          </tr>
          <tr>
            <td>引擎</td> <td>正常</td>
          </tr>
        </table>
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
			
			const dracoLoader = new THREE.DRACOLoader()
      dracoLoader.setDecoderPath(xv.url_prefix +'/web/cdn/three.js/0.131.3/draco/');
			
			const loader = new THREE.GLTFLoader().setPath(xv.url_prefix + __dirname);
			loader.setDRACOLoader(dracoLoader);
			// 模型单位 m, 场景单位 cm
			loader.load( '/model/train2.glb', ( gltf )=>{
        gltf.scene.translateX(-15);
        gltf.scene.translateY(1.9);
			  scene.add( gltf.scene );
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
      
			window.addEventListener( 'resize', onWindowResize );
			this.$refs.th.appendChild( renderer.domElement );
			animate();
			
			function setlight(scene) {
  			light1 = new THREE.DirectionalLight( 0xffffff );
  			light1.position.set( 1, 1, 1 );
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
        light1.position.set(t/10 % 300, 1, 1);
        floor1.position.set(t/30 % 100+50, 1, 1);
        floor2.position.set(t/30 % 100-50, 1, 1);
        floor3.position.set(t/30 % 100-100, 1, 1);
  			controls.update();
  			render();
  			requestAnimationFrame(animate);
  		// 	console.log(camera.position)
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