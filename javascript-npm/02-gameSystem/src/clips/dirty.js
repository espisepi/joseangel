import { Clip } from "./clip.js";
import { LoadGeneric } from '../loaders/loadGeneric.js';
import { AudioComponent } from '../components/videoclip0/audioComponent.js';
import * as THREE from '../../../node_modules/three/build/three.module.js';

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