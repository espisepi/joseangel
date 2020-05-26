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
var bagMesh;


function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.shadowMap.enabled = true;
	//renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setSize( window.innerWidth, window.innerHeight );

	// const fov = 45;
	// const aspect = 2;
	// const near = 1;
	// const far = 1000;
	// camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	// camera.position.z = 10;
	//camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	//camera.position.z = 5;
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

	// controls = new OrbitControls( camera, canvas );
	// controls.enableDamping = true;
	// controls.enablePan = false;
	// controls.minDistance = 0.2;
	// controls.maxDistance = 200;
	// controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xd8e2dc);

	createLights();

	loadModel();
	createFloor();

	// const loader = new THREE.TextureLoader();
	// const texture = loader.load(
	// 	'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
	// );
	// const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
	// const material = new THREE.MeshBasicMaterial({map: texture});
	// const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

	

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

 //    var helper = new THREE.DirectionalLightHelper( dirLight, 5 );
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

function loadModel(){
	// bagModel/Arch49_fabric_bump.jpg
	// bagModel/Arch49_leather_bump.jpg
	// bagModel/uv_grid_opengl.jpg
	const texture = new THREE.TextureLoader().load( 'bagModel/Arch49_leather_bump.jpg' );

	const loader = new OBJLoader();
	loader.load(
		'bagModel/bag.obj',
		function ( object ) {
			object.traverse((child)=>{
				if(child.isMesh){
					child.material.map = texture;
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			object.position.y = -1;
			scene.add( object );
			bagMesh = object;
		},
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);

}

function render() {

	if (resizeRendererToDisplaySize()) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

	renderer.render( scene, camera );
	controls.update();
	//TWEEN.update();
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

// function circularMenu(){
// 	const menu = document.getElementById('circularMenu');
// 	document.addEventListener('click', (e) =>{
// 		const valueSelected = e.options[e.selectedIndex].value;
// 		console.log(valueSelected);
// 	});
	
// }

// circularMenu();
main();
render();

(function() {
				[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
					new SelectFx(el, {
						stickyPlaceholder: false,
						onChange: function(val){
							var img = document.createElement('img');
							img.src = 'img/'+val+'.jpg';

							const texture = new THREE.TextureLoader().load( img.src );
							bagMesh.traverse((child)=>{
								if(child.isMesh){
									child.material.map = texture;
									child.castShadow = true;
									child.receiveShadow = true;
								}
							});

							img.onload = function() {
								document.querySelector('span.cs-placeholder').style.backgroundImage = 'url(img/'+val+'.jpg)';
							};
						}
					});
				} );
			})();
