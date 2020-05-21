// Basado en https://threejs.org/examples/?q=points#webgl_points_sprites

import * as THREE from './threejs/build/three.module.js';
import { OrbitControls } from './threejs/examples/jsm/controls/OrbitControls.js';

var renderer;
var scene;
var camera;
var controls;

var textureLoader = new THREE.TextureLoader();

var materials = [];
var parameters;

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

	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0xd8e2dc);

	createLights();

	createFloor();

	createParticles();

	// const loader = new THREE.TextureLoader();
	// const texture = loader.load(
	// 	'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
	// );
	// const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
	// const material = new THREE.MeshBasicMaterial({map: texture});
	// const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

}

function createParticles() {
	

	var geometry = new THREE.BufferGeometry();
	var vertices = [];
	
	var sprite1 = textureLoader.load( 'img/textures/sprites/snowflake1.png' );
	var sprite2 = textureLoader.load( 'img/textures/sprites/snowflake2.png' );
	var sprite3 = textureLoader.load( 'img/textures/sprites/snowflake3.png' );
	var sprite4 = textureLoader.load( 'img/textures/sprites/snowflake4.png' );
	var sprite5 = textureLoader.load( 'img/textures/sprites/snowflake5.png' );

	for ( var i = 0; i < 10000; i ++ ) {

		var x = Math.random() * 2000 - 1000;
		var y = Math.random() * 2000 - 1000;
		var z = Math.random() * 2000 - 1000;

		vertices.push( x, y, z );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	// parameters = [
	// 	[[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
	// 	[[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
	// 	[[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
	// 	[[ 0.85, 0, 0.5 ], sprite5, 8 ],
	// 	[[ 0.80, 0, 0.5 ], sprite4, 5 ]
	// ];

	parameters = [
		[[ 0.80, 0, 0.5 ], sprite4, 5 ]
	];

	for ( var i = 0; i < parameters.length; i ++ ) {

		var color = parameters[ i ][ 0 ];
		var sprite = parameters[ i ][ 1 ];
		var size = parameters[ i ][ 2 ];

		materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
		materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

		var particles = new THREE.Points( geometry, materials[ i ] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		scene.add( particles );

	}
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

function render(time) {
	time *= 0.000005;
	//var time = Date.now() * 0.00005;
	if (resizeRendererToDisplaySize()) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    updateParticles(time);

	renderer.render( scene, camera );
	//TWEEN.update();
	requestAnimationFrame( render );
};

function updateParticles(time) {
	for ( var i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.Points ) {

			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

		}

	}

	for ( var i = 0; i < materials.length; i ++ ) {

		var color = parameters[ i ][ 0 ];

		var h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
		materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

	}

}

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