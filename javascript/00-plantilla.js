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
var humanMesh;


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
