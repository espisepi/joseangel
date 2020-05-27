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

var parameters;
var spriteMaterials = [];

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
    controls.maxDistance = 100;
    controls.minDistance = 10;


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
	createParticles();

}

function createParticles() {

	let vertices = [];
	for ( let i = 0; i < 100; i ++ ) {

		let x = Math.random() * 2000 - 1000;
		let y = Math.random() * 2000 - 1000;
		let z = Math.random() * 2000 - 1000;
		//let z = Math.random() * 2000 - 1000;

		vertices.push( x, y, z );

	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	const sprite1 = textureLoader.load( 'img/spriteTextures/snowflake1.png' );
	const sprite2 = textureLoader.load( 'img/spriteTextures/snowflake2.png' );
	const sprite3 = textureLoader.load( 'img/spriteTextures/snowflake3.png' );
	const sprite4 = textureLoader.load( 'img/spriteTextures/snowflake4.png' );
	const sprite5 = textureLoader.load( 'img/spriteTextures/snowflake5.png' );

	parameters = [
		[[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
		// [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
		// [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
		// [[ 0.85, 0, 0.5 ], sprite5, 8 ],
		[[ 0.80, 0, 0.5 ], sprite4, 5 ]
	];

	for ( let i = 0; i < parameters.length; i ++ ) {

		let color = parameters[ i ][ 0 ];
		let sprite = parameters[ i ][ 1 ];
		let size = parameters[ i ][ 2 ];

		spriteMaterials[ i ] = new THREE.PointsMaterial( { size: size,depthTest: true, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
		spriteMaterials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

		let particles = new THREE.Points( geometry, spriteMaterials[ i ] );
		particles.name = "particles";

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		scene.add( particles );

	}
}


function createLights() {
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
            1000,
            1000,
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
			//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);

}

function render( time ) {

	time *= 0.000005;

	if (resizeRendererToDisplaySize()) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    updateParticles( time );

	renderer.render( scene, camera );
	controls.update();
	requestAnimationFrame( render );
};


/*const particles = scene.getObjectByName('particles');
	particles.rotation.y += time;
	spriteMaterials.forEach( (material, i) => {
		const color = parameters[ i ][ 0 ];
		const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
		material.color.setHSL( h, color[ 1 ], color[ 2 ] );
	} );*/

function updateParticles( time ) {

	for ( let i = 0; i < scene.children.length; i ++ ) {

		let object = scene.children[ i ];

		if ( object instanceof THREE.Points ) {

			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

		}

	}

	for ( let i = 0; i < spriteMaterials.length; i ++ ) {

		let color = parameters[ i ][ 0 ];

		let h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
		spriteMaterials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

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
