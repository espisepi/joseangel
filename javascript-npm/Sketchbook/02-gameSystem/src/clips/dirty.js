import { Clip } from "./clip.js";
import { LoadGeneric } from '../loaders/loadGeneric.js';
import { AudioComponent } from '../components/videoclip0/audioComponent.js';
import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Dirty_tween } from '../clips/dirty_tween.js';

export class Dirty extends Clip {
    constructor(renderer, params) {
        super(renderer, params);
    }

    loadScene() {
        this.textures = {
            masna: {url: '../assets/textures/masnaisraelb.png'},
        }
        this.audios = {
            principal: {url: '../assets/audios/masnaisraelb.mp3'},
        };
        const textureLoader = new THREE.TextureLoader();
        const audioLoader = new THREE.AudioLoader();
        Promise.all([
            LoadGeneric.load( this.textures, textureLoader ),
            LoadGeneric.load( this.audios, audioLoader ),
        ]).then(result => {
            this.loadedScene();
        });
    }

    loadedScene() {
        const geometry = new THREE.SphereBufferGeometry(  1, 32, 32 );
        const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } );
        const plane = new THREE.Mesh( geometry, material );
        const gameObjectPlane = this.gameObjectManager.createGameObject(this.scene, 'sphere');
        gameObjectPlane.transform.position.y = 0.5;
        const params = {
            audio: this.audios.principal,
            mesh: plane,
            texture: this.textures.masna.loader,
            animation: 'altavoces',
        };
        const planeComponent = gameObjectPlane.addComponent(AudioComponent, params);
        
        const paramsTween = {
            tweenManager: this.tweenManager,
            sphereMusic: planeComponent.mesh,
        };
        this.tween(paramsTween);
    }

    tween(paramsTween) {
        const tween = new Dirty_tween(paramsTween);
    }
}