import { Clip } from './clip.js';
import { LoadGeneric } from '../loaders/loadGeneric.js';
import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import { CarComponent } from '../components/carComponent.js';
import * as THREE from '../../../node_modules/three/build/three.module.js';
import { Component } from '../components/component.js';

export class CarClip extends Clip {
    constructor( renderer, params ){
        super(renderer, params);
    }
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0x000000, 10, 50 );

        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }
    createLights() {
        const light = new THREE.AmbientLight( 0x404040 );
        this.scene.add(light);

        const lightHemisphere = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( lightHemisphere );


    }
    loadScene() { 
        this.models = {
            car: {url: '../assets/models/ferrari/ferrari.glb'},
        };
        const loader = new GLTFLoader();
        /* DRACOLoader instance to decode compressed mesh data */
        const dracoLoader = new DRACOLoader();
        const pathRoot = '../node_modules/three';
        dracoLoader.setDecoderPath( pathRoot + '/examples/js/libs/draco/gltf/' );
        loader.setDRACOLoader( dracoLoader );
        Promise.all([
            LoadGeneric.load(this.models, loader),
        ]).then(result => {
            this.loadedScene();
        });
    }
    loadedScene() {
        const carGameObject = this.gameObjectManager.createGameObject(this.scene, 'car');
        const carComponent = carGameObject.addComponent(CarComponent, this.models.car, this.globals);

        this.floorCreate();
    }

    floorCreate() {
        const geometry = new THREE.PlaneBufferGeometry( 80, 80, 50, 50 );
        const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, wireframe: true } );
        const plane = new THREE.Mesh( geometry, material );
        plane.rotation.x = Math.PI / 2;
        const floorGameObject = this.gameObjectManager.createGameObject(this.scene, 'floor');
        const floorComponent = floorGameObject.addComponent(Component);
        floorComponent.gameObject.transform.add(plane);
        floorComponent.update = () =>{
            plane.position.z = this.globals.time % 8;
        }

        const planeCroma = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
        );
        this.scene.add(planeCroma);
    }

    // update() {
    //     //console.log('hhh');
    // }
}