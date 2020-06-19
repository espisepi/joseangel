import * as THREE from '../../../node_modules/three/build/three.module.js';
import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {ControlsManager} from '../controlsManager.js';
import {TweenManager} from '../tweenManager.js';
import {GameObjectManager} from '../gameObjectManager.js';
import { CubeWireframeComponent } from '../components/videoclip0/cubeWireframeComponent.js';
import { Masna_00_Tween } from './masna_00_tween.js';
import { PlaneVideoComponent } from '../components/videoclip0/planeVideoComponent.js';
import { Clip } from './clip.js';
import { LoadGeneric } from '../loaders/loadGeneric.js';
export class Masna_00 extends Clip {
    
    constructor(renderer, params ){
        super(renderer, params);
        this.renderer = renderer;
        this.globals = params.globals;
    }

    loadScene() {
        this.textures = {
            masna: {url: '../assets/textures/masnaisraelb.png'},
        }
        const textureLoader = new THREE.TextureLoader();
        Promise.all([
            LoadGeneric.load( this.textures, textureLoader ),
        ]).then(result => {
            this.loadedScene();
        });

    }
    loadedScene() {
        this.camera.position.set(0.0, 1.0, 3.92);
        const gameObjectCube = this.gameObjectManager.createGameObject(this.scene, 'cube');
        const cubeWireframeComponent = gameObjectCube.addComponent(CubeWireframeComponent);
        const objectsToAnimate = {
            cubeWireframeComponent
        };
        cubeWireframeComponent.cube.position.set(0,1,0);
        const clip1Tween = new Masna_00_Tween(this.tweenManager, objectsToAnimate);
 
        const gameObjectPlaneVideo = this.gameObjectManager.createGameObject(this.scene, 'planeVideo');
        const planeVideoComponent = gameObjectPlaneVideo.addComponent(PlaneVideoComponent, this.textures.masna);
        planeVideoComponent.plane.position.set(0,1,0);
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