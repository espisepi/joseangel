import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/utils/SkeletonUtils.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

import {GameObject} from './gameObject.js';
import {GameObjectManager} from './gameObjectManager.js';
import {PlayerComponent} from './components/playerComponent.js';

export class World {

	constructor() {

		this.init();

		// Variable used by render()
		this.then = 0;

		this.render();

	}

	init() {
		const canvas = document.querySelector('#c');
	  	const renderer = new THREE.WebGLRenderer({canvas});

		const fov = 45;
		const aspect = 2;  // the canvas default
		const near = 0.1;
		const far = 1000;
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 10, 20);

		const controls = new OrbitControls(camera, renderer.domElement);
		//controls.enableKeys = true;
		//controls.target.set(0, 5, 0);
		//controls.update();

		const scene = new THREE.Scene();
		scene.background = new THREE.Color('black');

		function addLight(...pos) {
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(...pos);
			scene.add(light);
			scene.add(light.target);
		}
		addLight(5, 5, 2);
		addLight(-5, 5, 5);

		/* ************* LOADERS ***************** */

		  const manager = new THREE.LoadingManager();
		  manager.onLoad = init;
		  const progressbarElem = document.querySelector('#progressbar');
		  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
		    progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
		  };
		  const models = {
		    pig:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pig.gltf' },
		    cow:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf' },
		    llama:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Llama.gltf' },
		    pug:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pug.gltf' },
		    sheep:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Sheep.gltf' },
		    zebra:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Zebra.gltf' },
		    horse:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Horse.gltf' },
		    knight: { url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf' },
		  };
		  const globals = {
		    time: 0.0,
		    deltaTime: 0.0
		  };

		  const gltfLoader = new GLTFLoader(manager);
		  for (const model of Object.values(models)) {
		    gltfLoader.load(model.url, (gltf) => {
		      model.gltf = gltf;
		    });
		  }

		  function prepModelsAndAnimations() {
		    const box = new THREE.Box3();
		    const size = new THREE.Vector3();
		    Object.values(models).forEach(model => {
		      box.setFromObject(model.gltf.scene);
		      box.getSize(size);
		      model.size = size.length();
		      const animsByName = {};
		      model.gltf.animations.forEach((clip) => {
		        animsByName[clip.name] = clip;
		        // Should really fix this in .blend file
		        if (clip.name === 'Walk') {
		          clip.duration /= 2;
		        }
		      });
		      model.animations = animsByName;
		    });
		  }

		  const gameObjectManager = new GameObjectManager();
		  function init() {
		  	const loadingElem = document.querySelector('#loading');
		    loadingElem.style.display = 'none';
		    
		    prepModelsAndAnimations();

		    const gameObjectPlayer = gameObjectManager.createGameObject(scene, 'player');
		    const componentPlayer = gameObjectPlayer.addComponent(PlayerComponent,models["llama"],globals);

		    //console.log(models);

		    /* ----- MAIN PRINCIPAL ------*/
		    






		  }



		  /* ************* -LOADERS- **************** */

		  this.renderer = renderer;
		  this.camera = camera;
		  this.scene = scene;

	}
	render(time) {

		const renderer = this.renderer;
		const scene = this.scene;
		const camera = this.camera;

		if (this.resizeRendererToDisplaySize(renderer)) {
	      const canvas = renderer.domElement;
	      camera.aspect = canvas.clientWidth / canvas.clientHeight;
	      camera.updateProjectionMatrix();
	    }

	    // convert to seconds
	    this.time = time * 0.001;
	    // make sure delta time isn't too big.
	    this.deltaTime = Math.min(this.time - this.then, 1 / 20);
	    this.then = this.time;

	    //gameObjectManager.update();
	  	renderer.render(scene,camera);

	  	requestAnimationFrame(this.render);
	}
	resizeRendererToDisplaySize() {

	}
}

const world = new World();