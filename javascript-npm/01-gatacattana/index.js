import * as THREE from './node_modules/three/build/three.module.js';
import { BufferGeometryUtils } from './node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './node_modules/three/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

import { Water } from './node_modules/three/examples/jsm/objects/Water.js';
import { Sky } from './node_modules/three/examples/jsm/objects/Sky.js';
import { Reflector } from './node_modules/three/examples/jsm/objects/Reflector.js';

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

var renderer;
var scene;
var camera;
var controls;

var textureLoader = new THREE.TextureLoader();

var mixer;

var stats;

var video;

// audio
// let audio, analyser;
// const fftSize = 2048;  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
// const frequencyRange = {
//     bass: [20, 140],
//     lowMid: [140, 400],
//     mid: [400, 2600],
//     highMid: [2600, 5200],
//     treble: [5200, 14000],
// };


function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.shadowMap.enabled = true;

	// camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
	// camera.position.z = 30;
 //  camera.position.y = 20;

 camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
 //camera.position.set( 30, 30, 100 );
 camera.position.set( 52.74, 52.74, 175.80 );
 //camera.position.set( -752.6680104833616, 123.90549192335402, -9.561435083130343 );
 //camera.rotation.set(0,-3,0);

  controls = new OrbitControls( camera, canvas );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd8e2dc);

  let container = document.createElement( 'div' );
  document.body.appendChild( container );
  stats = new Stats();
  container.appendChild( stats.dom );

  createLights();

  //createFloor();

  //initAudio();

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
    loadTextureVideo('gotham'),
    ])
  .then(result => {

    /* ------------  TODAS LAS PROMESAS FUERON RESUELTAS -----------*/

    let [ textures, lut, shaders, geometry, gothamTexture ] = result;


    /* --------------- HORSE ----------------------*/
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const resolution = new THREE.Vector2(width, height);

    textures[0] = gothamTexture;
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


    geometry.scale.set( 1, 1, 1 );
    geometry.name = "horse";
    //geometry.rotation.set(3,0,0);
    scene.add(geometry);

    // --------------- WATER -------------

    const waterGeometry = new THREE.BoxBufferGeometry( 10000, 10000, 10000 );

    //const waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
	const water = new Water(
		waterGeometry,
		{
			side: THREE.BackSide,
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
	//water.rotation.x = - Math.PI / 2;
	water.position.y = 5000;
	water.name = "water";
	scene.add( water );

	scene.background = gothamTexture;

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

    video = document.getElementById( idDomVideo );
    //video.muted = true;
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

	// const horse = scene.getObjectByName('horse');
	// if(horse){
	// 	horse.rotation.y += 0.01;
	// }

	stats.update();
	TWEEN.update();

	checkTweenAnimation();


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


let btn = document.getElementById('btn-iniciar');
btn.addEventListener('click', () => {
  btn.style.display = 'none';
  main();
  render();
});

// main();
// render();



/* ------------------- TWEEN ------------------- */

function tween1() {

	//TWEEN.removeAll();
	// const posX =  442.9434333092014,
	// 	  posY = 111.44223594261443,
	// 	  posZ = 1.9354844143547656;

	const posX =  442.94,
	posY = 111.44,
	posZ = 1.93;

	// const posX =  454.97468971406664,
	// 	  posY = 40.20923868404839,
	// 	  posZ = -1.8033323631738967;

	let camerax = camera.position.x;
	let cameraY = camera.position.y;
	let cameraZ = camera.position.z;

	camerax += 5;

	let from = {
            x: camerax,
            y: cameraY,
            z: cameraZ
        };

    let to = {
        x: posX,
        y: posY,
        z: posZ
    };
    let tween = new TWEEN.Tween(from)
        .to(to, 20000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
        	camera.position.set(from.x, from.y, from.z);
        	//camera.lookAt(new THREE.Vector3(0, 0, 0));
    	})
        .onComplete(function () {
        	//controls.target.copy(scene.position);
    	})
        .start();

}

var animations = [ tween1 ];
function checkTweenAnimation() {
	if(animations.length != 0) {
		if(video.currentTime > 10.0) {
			(animations.pop())();
		}
	}
	
	
}

// function initAudio() {
//     const audioListener = new THREE.AudioListener();
//     audio = new THREE.Audio(audioListener);

//     const audioLoader = new THREE.AudioLoader();
//     // https://www.newgrounds.com/audio/listen/872056
//     audioLoader.load('assets/gotham.mp3', (buffer) => {
//         audio.setBuffer(buffer);
//         audio.setLoop(true);
//         audio.setVolume(0.5);
//         audio.play();
//     });

//     analyser = new THREE.AudioAnalyser(audio, fftSize);
// };









