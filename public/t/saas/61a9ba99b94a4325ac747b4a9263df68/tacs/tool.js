/* Create By xBoson System */
const path = require('path');
const loaderCache = {};

const loaderMap = {
  '.glb' : getGLTFLoader,
  '.gltf': getGLTFLoader,
}

module.exports = {
  getTHREE,
  loadModel,
  domToWorld, 
  toWorld,
  addLine,
};


async function getTHREE(...libs) {
  const BASE = "cdn/three.js/0.131.3";
  let THREE = await require(BASE +"/three.min.js", 1, 0, 1);
  window.THREE = THREE;
  
  for (let i=0; i<libs.length; ++i) {
    await require(BASE + libs[i], 1,0,1);
  }
  // window.THREE = 'removed';
  return THREE;
}


function loadModel(scene, filename, cb) {
  let loader = getTheLoader(filename);
	// 模型单位 m, 场景单位 cm
	loader.load(filename, model=>{
	  scene && scene.add(model.scene);
	  cb && cb(model);
	});
}


function getTheLoader(filename) {
  let ext = path.extname(filename);
  let loader = loaderCache[ext];
  if (loader) {
    return loader;
  }
  
  let fn = loaderMap[ext];
  if (!fn) {
    throw new Error("No model loader for "+ filename);
  }
  return loaderCache[ext] = fn();
}


function getGLTFLoader() {
  const dracoLoader = new THREE.DRACOLoader()
  dracoLoader.setDecoderPath(xv.url_prefix +'/web/cdn/three.js/0.131.3/draco/');
	
	const loader = new THREE.GLTFLoader().setPath(xv.url_prefix + __dirname);
	loader.setDRACOLoader(dracoLoader);
	return loader;
}


function domToWorld(dom, camera) {
  let pos = dom.getBoundingClientRect();
  return toWorld(pos.left, pos.top, camera);
}


function toWorld(x, y, camera) {
  const x1 = ( x / window.innerWidth ) * 2 - 1;
  const y1 = -( y / window.innerHeight ) * 2 + 1;
  //标准设备坐标(z=0.5这个值并没有一个具体的说法)
  const stdVector = new THREE.Vector3(x1, y1, 0.1);
  const worldVector = stdVector.unproject(camera);
  return worldVector;
}


// p1 是静态, p2 是动态
function addLine(p1, p2, scene) {
  const material = new THREE.LineBasicMaterial({
  	color: 0xffff00
  });
  material.linecap = 'round';

  const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const line = new THREE.Line( geo, material );
  scene.add( line );
  
  return {
    line,
    moveEndTo,
  };
  
  function moveEndTo(vec) {
    let arr = geo.attributes.position.array;
    if (arr[3] != vec.x || arr[4] != vec.y || arr[5] != vec.z) {
      arr[3] = vec.x;
      arr[4] = vec.y;
      arr[5] = vec.z;
      geo.attributes.position.needsUpdate = true;
    }
  }
}