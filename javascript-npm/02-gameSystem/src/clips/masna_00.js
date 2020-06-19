import * as THREE from '../../../node_modules/three/build/three.module.js';
import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {ControlsManager} from '../controlsManager.js';
import {TweenManager} from '../tweenManager.js';
import {GameObjectManager} from '../gameObjectManager.js';
import { CubeWireframeComponent } from '../components/videoclip0/cubeWireframeComponent.js';
import { Clip1Tween } from './clip1Tween.js';
import { PlaneVideoComponent } from '../components/videoclip0/planeVideoComponent.js';

export class Masna_00 {
    constructor(renderer, withControls, globals ){
        this.renderer = renderer;
        
        const loadingElem = document.querySelector('#loading');
        loadingElem.style.display = 'none';

         // this.globals = {
        //     time: 0.0,
        //     deltaTime: 0.0
        // };
        this.globals = globals;

        this.createRenderTarget();
        this.createScene();
        this.createCamera();
        if(withControls){
            this.createControls();
        }
        this.createLights();

        this.gameObjectManager = new GameObjectManager();
        this.tweenManager = new TweenManager();
          
        this.loadModels();
       

    }
    createRenderTarget() {
        const renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
    }
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('black');
        //this.scene.background = new THREE.Color(0x300000);
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
            llama:  { url: '../assets/models/video_monitor/scene.gltf' },
          };
        
        const video = document.getElementById( 'video' );
        video.muted = true;
        video.play();
        const texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        this.textures = {
            videoTexture:
                {
                    texture: texture,
                    domElement: video
                },
        };

        // Load Sound mp3 of the music
        // Usar loaders promises (gatacattana)
        // tener un metodo al que se llama cuando se han cargado models y audios con promesas asincronas
        this.audios = {
            audioPrincipal: {url: '../../../assets/audios/masnaIsraelb.mp3'}
        }
        const audioLoader = new THREE.AudioLoader(manager);
        for (const audio of Object.values(this.audios)) {
            audioLoader.load(
                audio.url,
                (audioBuffer) => {
                    audio.buffer = audioBuffer;
                }
            )
        }


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

        
        const scene = this.scene;
        const gameObjectManager = this.gameObjectManager;
        const tweenManager = this.tweenManager;
        const self = this;
        
        function modelsLoaded() {

            /* 
                Aqui tenemos todas las texturas y modelos cargados en memoria.
                La propiedad "this" dentro del metodo modelsLoaded se refiere al objeto LoadingManager
                por lo tanto no podemos utilizarla, asi que utilizamos variables const
            */

            prepModelsAndAnimations();

            const gameObjectPlayer = gameObjectManager.createGameObject(scene, 'player');
            const cubeWireframeComponent = gameObjectPlayer.addComponent(CubeWireframeComponent);
            const objectsToAnimate = {
                cubeWireframeComponent
            };
            const clip1Tween = new Clip1Tween(tweenManager, objectsToAnimate);

            const gameObjectPlaneVideo = gameObjectManager.createGameObject(scene, 'planeVideo');
            const planeVideoComponent = gameObjectPlaneVideo.addComponent(PlaneVideoComponent, self.textures.videoTexture);

            console.log(self.audios.audioPrincipal.buffer);

        }
    }
    
    update(time) {
        if(this.controls){
            this.controls.update(this.globals.deltaTime);
        }
        this.tweenManager.update();
        this.gameObjectManager.update(this.globals);
    }

    render(rtt = false) {
        const renderer = this.renderer;
        //renderer.setClearColor( 0xffffff );

        if ( rtt ) {

            renderer.setRenderTarget( this.fbo );
            renderer.clear();
            renderer.render( this.scene, this.camera );
            renderer.setRenderTarget( null );

        } else {

            renderer.setRenderTarget( null );
            renderer.render( this.scene, this.camera );

        }
    }
}