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

var mixer;


function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.shadowMap.enabled = true;

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 30;
  camera.position.y = 20;

  controls = new OrbitControls( camera, canvas );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd8e2dc);

  createLights();

  //createFloor();

  loadPromises();
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
    loadShader('./asset/rust/shaders/horseMod.frag'),
    loadShader('./asset/rust/shaders/horseMod.vert'),
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
    loadGeometry('./asset/rust/Horse.glb'),
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

    /*
	
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

    */

      const mat = new THREE.ShaderMaterial({
      vertexShader: shaders[1],
      fragmentShader: shaders[0],
      uniforms: Object.assign({}, THREE.UniformsLib.lights, {
        iResolution: {  value: resolution },
        iChannel0: {  value: textures[0] },
        iChannel1: {  value: textures[1] },
        iLookup: {  value: lut },
        opacity: {  value: 1 },
        morphTargetInfluences: {  value: geometry.morphTargetInfluences },
        diffuse: {  value: new THREE.Color(0xffffff) },
        iGlobalTime: {  value: 0 },
      }),
      FlatShading: true,
      lights: true,
      morphTargets: true,
      defines: {
        USE_MORPHTARGETS: '',
        USE_MAP: ''
      }
    });
    // const material = geometry.material;
    // material.onBeforeCompile = ( shader ) => {
    //             shader.uniforms.time = { value: 0 };
    //             shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
    //             shader.vertexShader = shader.vertexShader.replace(
    //                 '#include <begin_vertex>',
    //                 [
    //                     'float theta = sin( time + position.y ) / 2.0;',
    //                     'float c = cos( theta );',
    //                     'float s = sin( theta );',
    //                     'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
    //                     'vec3 transformed = vec3( position ) * m;',
    //                     'vNormal = vNormal * m;'
    //                 ].join('\n')
    //             );
    //             this.shaderMaterial = new THREE.ShaderMaterial({
    //                 uniforms: shader.uniforms,
    //                 vertexShader: shader.vertexShader,
    //                 fragmentShader: shader.fragmentShader
    //             });
    //             //console.log(this.shaderMaterial.uniforms.time.value);
    //         }

    // geometry.traverse( function ( object ) {
    //       if ( object.isMesh ) object.material.program = shaders[0];
    // });
    //const mesh = new THREE.Mesh(geometry.geometry, geometry.material);

    geometry.material.onBeforeCompile = function ( shader ) {
        shader.fragmentShader = shaders[0];
        Object.assign(shader.uniforms,mat.uniforms);
        shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader;
        shader.vertexShader = 'uniform vec2 iResolution;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          [ 
            '#include <begin_vertex>',
            'vec4 newPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            'vec2 screenPos = newPosition.xy / newPosition.w;',
            'vUv = screenPos;',
            'vUv.x *= iResolution.x / iResolution.y;'
          ].join('\n')
          );




        console.log(shader.vertexShader);
      

    };


    geometry.scale.set( 0.5, 0.5, 0.5 );
    //geometry.rotation.set(3,0,0);

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
      path,
      function ( gltf ) {

        const mesh = gltf.scene.children[ 0 ];

        // Si queremos sombras para el modelo descomentamos el codigo
        // model.traverse( function ( object ) {
        //   if ( object.isMesh ) object.castShadow = true;
        // });

		mixer = new THREE.AnimationMixer( mesh );
		mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();

        resolve(mesh);

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

var prevTime = Date.now();
function render(time) {

	if (resizeRendererToDisplaySize()) {
	    const canvas = renderer.domElement;
	    camera.aspect = canvas.clientWidth / canvas.clientHeight;
	    camera.updateProjectionMatrix();
  	}

	if ( mixer ) {
		let time = Date.now();

		mixer.update( ( time - prevTime ) * 0.001 );
		
		prevTime = time;
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






