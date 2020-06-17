//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import { Component } from "../component.js";


export class PlaneVideoComponent extends Component{
    /* @Params
        gameObject: GameObject
        videoTexture: { texture: THREE.VideoTexture, domElement: <video> html }
    */
    constructor(gameObject, videoTexture) {
        super(gameObject);

        const geometry = new THREE.PlaneBufferGeometry( 1, 1, 0 );
        const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: videoTexture.texture } );
        this.plane = new THREE.Mesh( geometry, material );
        gameObject.transform.add(this.plane);

    }
    update(globals){

    }
}