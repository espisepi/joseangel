import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js';
import {ControlsManager} from '../controlsManager.js';
import {TweenManager} from '../tweenManager.js';
import {GameObjectManager} from '../gameObjectManager.js';
import {HorseModelComponent} from '../components/videoclip0/horseModelComponent.js';
import { CubeWireframeComponent } from '../components/videoclip0/cubeWireframeComponent.js';
import { Clip1Tween } from './clip1Tween.js';
export class Clip1 {
    constructor(renderer){
        this.renderer = renderer;
        const loadingElem = document.querySelector('#loading');
        loadingElem.style.display = 'none';

        this.createScene();
        this.createCamera();
        this.createControls();
        this.createLights();

        this.gameObjectManager = new GameObjectManager();
        this.tweenManager = new TweenManager();
          
        this.loadModels();
       

    }
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('black');
    }
    createCamera() {
        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 5);
        this.camera = camera;
    }
    createControls() {
        this.controls = new ControlsManager('orbitControls', this.camera, this.renderer.domElement);
    }
    createLights() {
        const scene = this.scene;
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
    }
    loadModels() {

        const manager = new THREE.LoadingManager();
        manager.onLoad = modelsLoaded;
        const progressbarElem = document.querySelector('#progressbar');
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
          progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
        };
        this.models = {
            pig:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pig.gltf' },
            cow:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf' },
            //llama:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Llama.gltf' },
            
            llama:  { url: '../assets/models/video_monitor/scene.gltf' },
            pug:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pug.gltf' },
            sheep:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Sheep.gltf' },
            zebra:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Zebra.gltf' },
            horse:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Horse.gltf' },
            knight: { url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf' },
          };
        this.globals = {
            time: 0.0,
            deltaTime: 0.0
        };
        
        const gltfLoader = new GLTFLoader(manager);
        for (const model of Object.values(this.models)) {
        gltfLoader.load(model.url, (gltf) => {
            model.gltf = gltf;
        });
        }

        const models = this.models;

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

        /*
            La propiedad "this" dentro del metodo modelsLoaded se refiere al objeto LoadingManager
            por lo tanto no podemos utilizarla, asi que utilizamos variables const
        */
        const scene = this.scene;
        const gameObjectManager = this.gameObjectManager;
        const tweenManager = this.tweenManager;
        
        function modelsLoaded() {

            prepModelsAndAnimations();

            const gameObjectPlayer = gameObjectManager.createGameObject(scene, 'player');
            const cubeWireframeComponent = gameObjectPlayer.addComponent(CubeWireframeComponent);
            
            const objectsToAnimate = {
                cubeWireframeComponent
            };
            const clip1Tween = new Clip1Tween(tweenManager, objectsToAnimate);
        }
    }
    
    update(time) {
        // convert to seconds
        this.globals.time = time * 0.001;
        // make sure delta time isn't too big.
        this.globals.deltaTime = Math.min(this.globals.time - this.then, 1 / 20);
        this.then = this.globals.time;
        this.controls.update(this.globals.deltaTime);
        this.tweenManager.update();
        this.gameObjectManager.update(this.globals);
    }
}