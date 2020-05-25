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
/* http://tweenjs.github.io/tween.js/examples/03_graphs.html */

function tween1() {

	// let group = new THREE.Group();
	// group.add( scene.getObjectByName('water') );
	// group.add( scene.getObjectByName('horse') );
	// scene.add(group);
	// group.rotation.y += 0.01;

	//TWEEN.removeAll();

	// Posicion cerca agua cerca caballo
	// x: 116.19039349035572
	// y: 4.317963425051384
	// z: 163.9805777172494

	// Posicion gataCattana
	// x =  442.94
	// y = 111.44
	// z = 1.93

	// Posicion cerca agua lejos caballo
	// x: 920.7504792035136
	// y: 4.997434958552961
	// z: 478.6020417334049

	// Posicion lejos agua lejos caballo
	// x: 33.40287279554564
	// y: 244.79757005677044
	// z: 1007.8813082126062

	//.to(to, 20000)


	let from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

    let to = {
        x: 116.19,
        y: 4.31,
        z: 163.98
    };

    let to2 = {
      	x:  442.94,
		y: 111.44,
		z: 1.93
    };


    let update = () => {
    	camera.position.set(from.x, from.y, from.z);
    	//camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    let tween1 = new TWEEN.Tween(from)
        .to(to, 11000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(update)
        .onComplete(function () {
        	//controls.target.copy(scene.position);
    	});

     let tween2 = new TWEEN.Tween(from)
        .to(to2, 16000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(update)
        .onComplete(function () {
        	//controls.target.copy(scene.position);
    	});

    tween1.chain(tween2);
    tween1.start();

}



function tween2() {

	let from = {
            posx: camera.position.x,
            posy: camera.position.y,
            posz: camera.position.z
        };

    let to = {
        posx: [920.75, 978.81, -731.71, camera.position.x],
        posy: [4.9974, 4.9974, 4.9974, camera.position.y],
        posz: [478.6020, -343.26, -735.06, camera.position.z]
    };

    let tween = new TWEEN.Tween(from)
        .to(to, 20000)
        .easing(TWEEN.Easing.Linear.None)
        //.interpolation(TWEEN.Interpolation.Linear)
        .onUpdate(function () {
        	//group.rotation.set(from.x, from.y, from.z);
        	camera.position.set(from.posx, from.posy, from.posz);
        	camera.lookAt(new THREE.Vector3(0, 0, 0));
        	//camera.lookAt(new THREE.Vector3(from.x, from.y, from.z));
    	})
        .onComplete(function () {
        	controls.target.copy(scene.position);
    	})
        .start();


}


//var animations = [ tween1, tween2 ];
var animations = [ tween1 ];
// Esta funcion es llamada por cada render()
function checkTweenAnimation() {
	if(animations.length != 0) {
		if(video.currentTime > 3.0) {
			(animations.pop())();
		}
	}

	// if(animations.length != 0) {
	// 	if(video.currentTime > 2.0) {
	// 		(animations.pop())();
	// 	}
	// }
	
	
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









