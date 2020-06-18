import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Clip } from './clip.js';
import { LoadGLTF } from '../loaders/loadGLTF.js';
import { HorseModelComponent } from '../components/videoclip0/horseModelComponent.js';
import { LoadGeneric } from '../loaders/loadGeneric.js';
import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

export class Clip2 extends Clip {
    constructor( renderer, withControls, globals ){
        super(renderer, withControls, globals);
    }
    loadScene() {
        this.scene.add(
            new THREE.Mesh(
                new THREE.BoxBufferGeometry(2,2,2),
                new THREE.MeshBasicMaterial({color:0xff0000})
            )
        );

        this.models = {
            monitor: {url: '../assets/models/video_monitor/scene.gltf'},
        };
        this.audios = {
            principal: {url: '../assets/audios/masnaisraelb.mp3'},
        };
        const audioLoader = new THREE.AudioLoader();
        const gltfLoader = new GLTFLoader();
        Promise.all([
            LoadGeneric.load(this.models, gltfLoader),
            LoadGeneric.load( this.audios, audioLoader ),
        ]).then(result => {
            this.loadedScene();
        });
        
    }
    loadedScene() {
        // En este metodo ya tendremos finalizadas todas las promesas
        console.log(this.audios);
        console.log(this.models);
        
        const gameObjectPlayer = this.gameObjectManager.createGameObject(this.scene, 'player');
        const modelComponent = gameObjectPlayer.addComponent(HorseModelComponent,this.models["monitor"],this.globals.deltaTime,this.tweenManager);
    }


}