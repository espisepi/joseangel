import * as THREE from '../../../node_modules/three/build/three.module.js';
import {ControlsManager} from '../controlsManager.js';
import {TweenManager} from '../tweenManager.js';
import {GameObjectManager} from '../gameObjectManager.js';

export class Clip {
    /**@params
     * renderer: THREE.WebGLRenderer
     * params: {
     *              globals: globals,
     *              controls: 'orbitControl'
     *          }
     */
    constructor( renderer, params ) {
        this.renderer = renderer;
        this.globals = params.globals;

        this.createRenderTarget();
        this.createScene();
        this.createCamera();
        this.createLights();
        if(params.controls){
            this.createControls(params.controls);
        }
        this.gameObjectManager = new GameObjectManager();
        this.tweenManager = new TweenManager();
        this.loadScene();
        
    }
    loadScene(){
        // Aqui cargamos toda la parafernalia
    }
    createRenderTarget() {
        const renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
    }
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('black');
    }
    createCamera() {
        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 5);
        this.camera = camera;
    }
    createLights() {
        const scene = this.scene;
        function addLight(...pos) {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(...pos);
            scene.add(light);
            scene.add(light.target);
          }
          addLight(5, 5, 2);
          addLight(-5, 5, 5);
    }
    createControls(controlName){
        this.controls = new ControlsManager(controlName, this.camera, this.renderer.domElement);
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