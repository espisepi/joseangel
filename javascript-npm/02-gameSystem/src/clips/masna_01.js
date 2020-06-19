import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Clip } from './clip.js';
import { LoadGeneric } from '../loaders/loadGeneric.js';
import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

import { AudioComponent } from '../components/videoclip0/audioComponent.js';
import { CubeWireframeComponent } from '../components/videoclip0/cubeWireframeComponent.js';

export class Masna_01 extends Clip {
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

    // En este metodo ya tendremos finalizadas todas las promesas
    loadedScene() {

        //this.scene.background = new THREE.Color(0xF1E9DE);
        this.camera.position.set(0.0, 1.0, 3.92);
        this.planeAudioCreate();
        this.floorCreate();
        
    }

    floorCreate() {
        const geometry = new THREE.PlaneBufferGeometry( 5, 5, 20, 20 );
        const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, wireframe: true } );
        const plane = new THREE.Mesh( geometry, material );
        plane.rotation.x = Math.PI / 2;
        const gameObjectPlane = this.gameObjectManager.createGameObject(this.scene, 'plane');
        gameObjectPlane.transform.add(plane);
    }

    planeAudioCreate() {
        const geometry = new THREE.PlaneBufferGeometry( 1, 1, 100, 100 );
        const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } );
        const plane = new THREE.Mesh( geometry, material );
        const gameObjectPlane = this.gameObjectManager.createGameObject(this.scene, 'plane');
        gameObjectPlane.transform.position.y = 0.5;
        const params = {
            audio: this.audios.principal,
            mesh: plane,
            texture: this.textures.masna.loader,
        };
        const planeComponent = gameObjectPlane.addComponent(AudioComponent, params);
    }

}