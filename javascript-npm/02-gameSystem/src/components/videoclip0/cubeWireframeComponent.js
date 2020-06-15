import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import { Component } from '../component.js';

export class CubeWireframeComponent extends Component {
    constructor(gameObject) {
        super(gameObject);
        
        const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {
                                            color: 0x00ff00,
                                            wireframe:true
                                            } );
        this.cube = new THREE.Mesh( geometry, material );
        gameObject.transform.add( this.cube );
    }
    update(globals){
        this.cube.rotation.set(globals.time, globals.time, 0);
    }
}