import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Clip } from './clip.js';
import { LoadGLTF } from '../loaders/loadGLTF.js';

export class Clip2 extends Clip {
    constructor( renderer, withControls, globals ){
        super(renderer, withControls, globals);
    }
    loadScene(){
        this.scene.add(
            new THREE.Mesh(
                new THREE.BoxBufferGeometry(2,2,2),
                new THREE.MeshBasicMaterial({color:0xff0000})
            )
        );
        
        this.models = {
            monitor: {url: '../assets/models/video_monitor/scene.gltf'},
        };

        Promise.all([
            LoadGLTF.load(this.models)
        ]).then(result => {
            console.log(this.models);
        });
        
    }
}