import * as THREE from './node_modules/three/build/three.module.js';
import { BufferGeometryUtils } from './node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './node_modules/three/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

import { Water } from './node_modules/three/examples/jsm/objects/Water.js';
import { Sky } from './node_modules/three/examples/jsm/objects/Sky.js';

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

var renderer;
var scene;
var camera;
var controls;

var textureLoader = new THREE.TextureLoader();

var mixer;

var stats;


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

  let container = document.createElement( 'div' );
  document.body.appendChild( container );
  stats = new Stats();
  container.appendChild( stats.dom );

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
    loadTexture('assets/factory.jpg', texOpt),
    loadTexture('assets/road.jpg', texOpt)
  ])

  const loadShaders = Promise.all([
    loadShader('./assets/shaders/horseMod.frag'),
    //horseMod.vert no esta siendo utilizado
    loadShader('./assets/shaders/horseMod.vert'),
    ]);


  /* Fin ejecucion promesas iniciales */



  /* Ejecutamos la promesa final (necesita las promesas iniciales) */

  Promise.all([
    loadTextures,
    loadTexture('assets/lut.png', {
      minFilter: THREE.LinearFilter,
      flipY: false,
      generateMipmaps: false
    }),
    loadShaders,
    loadGeometry('./assets/Horse.glb'),
    loadTextureVideo('video')
    ])
  .then(result => {

    /* ------------  TODAS LAS PROMESAS FUERON RESUELTAS -----------*/

    let [ textures, lut, shaders, geometry, videoTexture ] = result;


    /* --------------- HORSE ----------------------*/
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const resolution = new THREE.Vector2(width, height);

    textures[0] = videoTexture;
    //textures[1] = videoTexture;


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

    geometry.material.onBeforeCompile = function ( shader ) {
        shader.fragmentShader = mat.fragmentShader;
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
        //console.log(shader.vertexShader);
    };
    geometry.scale.set( 0.5, 0.5, 0.5 );
    //geometry.rotation.set(3,0,0);
    scene.add(geometry);

    // --------------- WATER -------------

    const waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
	const water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( 'assets/textures/waternormals.jpg', function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			alpha: 1.0,
			sunDirection: new THREE.Vector3(0 ,0.5, 0),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);
	water.rotation.x = - Math.PI / 2;
	water.name = "water";
	scene.add( water );


	// ---------- SKYBOX ------------
	// Skybox

	// const sky = new Sky();

	// const uniforms = sky.material.uniforms;

	// uniforms[ 'turbidity' ].value = 10;
	// uniforms[ 'rayleigh' ].value = 2;
	// uniforms[ 'luminance' ].value = 1;
	// uniforms[ 'mieCoefficient' ].value = 0.005;
	// uniforms[ 'mieDirectionalG' ].value = 0.8;

	// const parameters = {
	// 	distance: 400,
	// 	inclination: 0.49,
	// 	azimuth: 0.205
	// };

	// const cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
	// cubeCamera.renderTarget.texture.generateMipmaps = true;
	// cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;

	// scene.background = cubeCamera.renderTarget;
	// function updateSun() {

	// 	const theta = Math.PI * ( parameters.inclination - 0.5 );
	// 	const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

	// 	light.position.x = parameters.distance * Math.cos( phi );
	// 	light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
	// 	light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );

	// 	sky.material.uniforms[ 'sunPosition' ].value = light.position.copy( light.position );
	// 	water.material.uniforms[ 'sunDirection' ].value.copy( light.position ).normalize();

	// 	cubeCamera.update( renderer, sky );

	// }

	// updateSun();


    /* FIN TODAS LAS PROMESAS FUERON RESUELTAS */

  })
  .then(null, (err) => {
    console.error("Got error");
    console.error(err.stack);
  })
  .then(() => {
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
        //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
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

function loadTextureVideo( idDomVideo ) {
  return new Promise((resolve, rejected) => {

    const video = document.getElementById( idDomVideo );
    video.play();
    
    const textureVideo = new THREE.VideoTexture( video );
    textureVideo.minFilter = THREE.LinearFilter;
    textureVideo.magFilter = THREE.LinearFilter;
    textureVideo.format = THREE.RGBFormat;

    resolve(textureVideo);

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

	const water = scene.getObjectByName('water');
	if(water){
		water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
	}

	stats.update();
	


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


const btn = document.getElementById('btn-iniciar');
btn.addEventListener('click', () => {
  main();
  render();
});

// main();
// render();







