import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Clip } from './clip.js';
import { LoadGLTF } from '../loaders/loadGLTF.js';
import { HorseModelComponent } from '../components/videoclip0/horseModelComponent.js';
import { LoadGeneric } from '../loaders/loadGeneric.js';
import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

import { PlaneComponent } from '../components/videoclip0/planeComponent.js';
import { CubeWireframeComponent } from '../components/videoclip0/cubeWireframeComponent.js';

export class Clip2 extends Clip {
    constructor( renderer, withControls, globals ){
        super(renderer, withControls, globals);
    }
    loadScene() {
        this.models = {
            monitor: {url: '../assets/models/video_monitor/scene.gltf'},
        };
        this.audios = {
            principal: {url: '../assets/audios/masnaisraelb.mp3'},
        };
        this.textures = {
            masna: {url: '../assets/textures/masnaisraelb.png'},
        }
        const gltfLoader = new GLTFLoader();
        const audioLoader = new THREE.AudioLoader();
        const textureLoader = new THREE.TextureLoader();
        Promise.all([
            LoadGeneric.load(this.models, gltfLoader),
            LoadGeneric.load( this.audios, audioLoader ),
            LoadGeneric.load( this.textures, textureLoader ),
        ]).then(result => {
            this.loadedScene();
        });
        
    }
    loadedScene() {
        // En este metodo ya tendremos finalizadas todas las promesas
        console.log(this.audios);
        console.log(this.textures);

        //this.scene.background = new THREE.Color(0xF1E9DE);
        this.planeCreate();
        //this.cubeWireframeCreate();
        
    }

    planeCreate() {
        const gameObjectPlane = this.gameObjectManager.createGameObject(this.scene, 'plane');
        const params = {
            audio: this.audios.principal,
        };
        const planeComponent = gameObjectPlane.addComponent(PlaneComponent, params);
        planeComponent.setTexture(this.textures.masna.loader);
    }

    cubeWireframeCreate() {
        const gameObjectCubeWireframe = this.gameObjectManager.createGameObject(this.scene, 'cubeWireframe');
        const cubeWireframeComponent = gameObjectCubeWireframe.addComponent(CubeWireframeComponent);
    }

}