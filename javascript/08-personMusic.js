import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from './js/three.js/examples/jsm/geometries/DecalGeometry.js';

var renderer;
var scene;
var camera;
var controls;

var textureLoader = new THREE.TextureLoader();
var humanMesh;
let attributePositionInitial;

// audio
let audio, analyser;
const fftSize = 2048;  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const frequencyRange = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
};

function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	const fov = 45;
	const aspect = 2;
	const near = 1;
	const far = 1000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 10;
	//camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	//camera.position.z = 5;

	controls = new OrbitControls( camera, canvas );
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 0.2;
	controls.maxDistance = 200;
	controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	scene.add( new THREE.AmbientLight( 0x443333 ) );

	var light = new THREE.DirectionalLight( 0xffddcc, 1 );
	light.position.set( 1, 0.75, 0.5 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xccccff, 1 );
	light.position.set( - 1, 0.75, - 0.5 );
	scene.add( light );


	loadLeePerrySmith();
	initAudio();

	

}

function loadLeePerrySmith() {
	const loader = new GLTFLoader();
	loader.load( 'asset/LeePerrySmith/LeePerrySmith.glb', function ( gltf ) {

		humanMesh = gltf.scene.children[ 0 ];
		humanMesh.material = new THREE.MeshPhongMaterial( {
			specular: 0x111111,
			map: textureLoader.load( 'asset/LeePerrySmith/Map-COL.jpg' ),
			specularMap: textureLoader.load( 'asset/LeePerrySmith/Map-SPEC.jpg' ),
			normalMap: textureLoader.load( 'asset/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
			shininess: 25
		} );

		scene.add( humanMesh );
		humanMesh.scale.set( 1, 1, 1 );
		// Para modificarlo con el audio y no perder la posicion inicial
		// hacemos una copia de seguridad
		attributePositionInitial = humanMesh.geometry.attributes.position.array.slice();
	});

}

const initAudio = () => {
    const audioListener = new THREE.AudioListener();
    audio = new THREE.Audio(audioListener);

    const audioLoader = new THREE.AudioLoader();
    // https://www.newgrounds.com/audio/listen/872056
    audioLoader.load('asset/872056_Above-the-clouds.mp3', (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0.5);
        audio.play();
    });

    analyser = new THREE.AudioAnalyser(audio, fftSize);

    document.body.addEventListener('keypress', function () {
        if (audio) {
            if (audio.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
    });
};

/**
 * https://github.com/processing/p5.js-sound/blob/v0.14/lib/p5.sound.js#L1765
 *
 * @param data
 * @param _frequencyRange
 * @returns {number} 0.0 ~ 1.0
 */
const getFrequencyRangeValue = (data, _frequencyRange) => {
    const nyquist = 48000 / 2;
    const lowIndex = Math.round(_frequencyRange[0] / nyquist * data.length);
    const highIndex = Math.round(_frequencyRange[1] / nyquist * data.length);
    let total = 0;
    let numFrequencies = 0;

    for (let i = lowIndex; i <= highIndex; i++) {
        total += data[i];
        numFrequencies += 1;
    }
    return total / numFrequencies / 255;
};

function updateHumanMesh(){
	let bass,mid,treble;
	if(analyser){
		const data = analyser.getFrequencyData();
		bass = getFrequencyRangeValue(data, frequencyRange.bass);
       	mid = getFrequencyRangeValue(data, frequencyRange.mid);
        treble = getFrequencyRangeValue(data, frequencyRange.treble);
	}
	if(humanMesh){
		humanMesh.geometry.attributes.position.array = attributePositionInitial.slice();
		for(let i = 0, length = humanMesh.geometry.attributes.position.array.length; i < length; i += 6){
			//humanMesh.geometry.attributes.position.array[i + 0] += treble;
			//humanMesh.geometry.attributes.position.array[i + 1] += mid * 5;
			humanMesh.geometry.attributes.position.array[i + 2] += bass;
			humanMesh.geometry.attributes.position.array[i + 5] += -bass;
		}
		humanMesh.geometry.attributes.position.needsUpdate = true;		
	}
}

function render() {
	renderer.render( scene, camera );
	controls.update();
	updateHumanMesh();
	//TWEEN.update();
	requestAnimationFrame( render );
};

function onWindowResize() {

	const windowHalfX = window.innerWidth / 2;
	const windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//composer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );
// Necesitamos interactuar para reproducir audio
/* MAIN PRINCIPAL */
let btn = document.getElementById('btn-iniciar');
btn.addEventListener('click', () => {
  let overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  main();
  render();
});
