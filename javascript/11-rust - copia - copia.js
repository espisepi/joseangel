import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';

import { OBJLoader } from './js/three.js/examples/jsm/loaders/OBJLoader.js';

var renderer;
var scene;
var camera;
var controls;

var textureLoader = new THREE.TextureLoader();


function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.shadowMap.enabled = true;

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 30;
  camera.position.y = 20;

  controls = new OrbitControls( camera, canvas );
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 3;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.1;
  controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
  controls.autoRotateSpeed = 0.2; // 30

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd8e2dc);

  createLights();

  createFloor();

  loadPromises();

  loadModel();



}

function loadPromises() {


  /* Ejecutamos las promesas iniciales */

  const texOpt = { 
    minFilter: THREE.LinearFilter,
    generateMipmaps: false,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping
  }

  const loadTextures = Promise.all([
    loadTexture('asset/rust/factory.jpg', texOpt),
    loadTexture('asset/rust/road.jpg', texOpt)
  ])

  const loadShaders = Promise.all([
    loadShader('./asset/rust/shaders/helloWorld.frag'),
    //loadShader('./asset/rust/shaders/horseMod.vert'),
    loadShader('./asset/rust/shaders/helloWorld.vert'),
    ]);


  /* Fin ejecucion promesas iniciales */



  /* Ejecutamos la promesa final (necesita las promesas iniciales) */

  Promise.all([
    loadTextures,
    loadTexture('asset/rust/lut.png', {
      minFilter: THREE.LinearFilter,
      flipY: false,
      generateMipmaps: false
    }),
    loadShaders,
    loadGeometry('./asset/rust/elk.json')
    ])
  .then(result => {

    /* ------------  TODAS LAS PROMESAS FUERON RESUELTAS -----------*/

    let [ textures, lut, shaders, geometry ] = result;
    console.log('final----');
    console.log(result);

    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const resolution = new THREE.Vector2(width, height);

    const mat = new THREE.ShaderMaterial({
      vertexShader: shaders[1],
      fragmentShader: shaders[0],
      uniforms: Object.assign({}, THREE.UniformsLib.lights, {
        iResolution: { type: 'v2', value: resolution },
        iChannel0: { type: 't', value: textures[0] },
        iChannel1: { type: 't', value: textures[1] },
        iLookup: { type: 't', value: lut },
        opacity: { type: 'f', value: 1 },
        morphTargetInfluences: { type: 'f', value: 0 },
        diffuse: { type: 'c', value: new THREE.Color(0xffffff) },
        iGlobalTime: { type: 'f', value: 0 },
      }),
      shading: THREE.FlatShading,
      lights: true,
      morphTargets: true,
      defines: {
        USE_MORPHTARGETS: '',
        USE_MAP: ''
      }
    });

    geometry.traverse( function ( object ) {
          if ( object.isMesh ) object.material = mat;
    });

    scene.add(geometry);

    /* FIN TODAS LAS PROMESAS FUERON RESUELTAS */

  })
  .then(null, (err) => {
    console.error("Got error");
    console.error(err.stack);
  })
  .then(() => {
    console.log('loaddddding');
  });

}

/* ----  Metodos de promesas ------*/

function loadShader(path) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FileLoader();
    loader.load(
      path,
      function ( data ) {
        resolve(data);
      },
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function ( err ) {
        reject(new Error(`could not load image`))
      }
      );
  });
}

function loadGeometry(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load( 
      'asset/rust/Soldier.glb',
      function ( gltf ) {

        let model = gltf.scene;
        model.scale.set( 5, 5, 5 );

        // Si queremos sombras para el modelo descomentamos el codigo
        // model.traverse( function ( object ) {
        //   if ( object.isMesh ) object.castShadow = true;
        // });

        resolve(model);

      },
      function ( xhr ) {
      },
      function ( err ) {
        reject(new Error(`could not load model`))
      }
    );
  });
}

function loadTexture( path, opt = {} ) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      path,
      function ( texture ) {

        // añadimos las opciones opt a nuestra textura
        Object.assign(texture,opt);

        resolve( texture );
      },
    // onProgress callback currently not supported
    undefined,
    // onError callback
    function ( err ) {
      console.error( 'Error load texture: ${path}' );
    }
    );
  });
}

function loadModel() {
    //console.log(glslify);
  //   const mat = new THREE.ShaderMaterial({
  //   vertexShader: glslify('./shaders/horse.vert'),
  //   fragmentShader: glslify('./shaders/horse.frag'),
  //   uniforms: assign({}, THREE.UniformsLib.lights, {
  //     iResolution: { type: 'v2', value: resolution },
  //     iChannel0: { type: 't', value: assets.textures[0] },
  //     iChannel1: { type: 't', value: assets.textures[1] },
  //     iLookup: { type: 't', value: assets.lut },
  //     opacity: { type: 'f', value: 1 },
  //     morphTargetInfluences: { type: 'f', value: 0 },
  //     diffuse: { type: 'c', value: new THREE.Color(0xffffff) },
  //     iGlobalTime: { type: 'f', value: 0 },
  //   }),
  //   shading: THREE.FlatShading,
  //   lights: true,
  //   morphTargets: true,
  //   defines: {
  //     USE_MORPHTARGETS: '',
  //     USE_MAP: ''
  //   }
  // });
}

function createLights(){
	/* Hemisphere Light */
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
  hemiLight.position.set( 0, 0, 0);
  scene.add( hemiLight );

  /* Directional Light */
  const dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
  dirLight.position.set( -20, 20, 20 );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2( 1024, 1024 );
  scene.add( dirLight );

  var targetObject = new THREE.Object3D();
  targetObject.position.set(0,5,0);
  scene.add(targetObject);
  dirLight.target = targetObject;

 	// var helper = new THREE.DirectionalLightHelper( dirLight, 5 );
	// scene.add( helper );
}

function createFloor(){

	const floorGeometry = new THREE.PlaneGeometry(
    100,
    100,
    1,
    1
    );
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xffcad4,
    shininess: 0
  });

  const floor = new THREE.Mesh( floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -1;
  scene.add( floor );
}

function render() {

	if (resizeRendererToDisplaySize()) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render( scene, camera );
  controls.update();
  requestAnimationFrame( render );
};

function resizeRendererToDisplaySize() {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}


main();
render();







/* PROMISE EXAMPLE */

//loadPromises();
// function loadPromises() {

//     const loadShaders = Promise.all([
//       loadShader('./asset/rust/shaders/horseMod.frag'),
//       loadShader('./asset/rust/shaders/horseMod.vert'),
//       ]);

//     Promise.all([
//       loadShaders
//       ])
//     .then(result => {
//       let [ shaders ] = result;

//       const fragmentShader = shaders[0];
//       const vertexShader = shaders[1];

//       const material = new THREE.ShaderMaterial({
//         vertexShader,
//         fragmentShader,
//         uniforms: {},
//       });
//       const geometry = new THREE.PlaneBufferGeometry(20, 20, 20, 20);
//       const mesh = new THREE.Mesh(geometry, material);
//       scene.add(mesh);
//     })
//     .then(null, (err) => {
//       console.error("Got error");
//       console.error(err.stack);
//     })
//     .then(() => {
//       console.log('loaddddding');
//     });

//     function loadShader(path) {
//       return new Promise((resolve, reject) => {
//         const loader = new THREE.FileLoader();
//         loader.load(
//           path,
//           function ( data ) {
//             resolve(data);
//           },
//           function ( xhr ) {
//             console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
//           },
//           function ( err ) {
//             reject(new Error(`could not load image`))
//           }
//           );
//       });
//     }

//   }






