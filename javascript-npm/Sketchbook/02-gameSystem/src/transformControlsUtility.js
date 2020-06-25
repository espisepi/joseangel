import { TransformControls } from '../../node_modules/three/examples/jsm/controls/TransformControls.js';
import * as THREE from '../../node_modules/three/build/three.module.js';

export class TransformControlsUtility {
    constructor(clip) {
        this.clip = clip;
        this.controls = new TransformControls( clip.camera, clip.renderer.domElement );
        // Esperamos a que la escena "clip" cargue sus elementos
        setTimeout(() => { this.createControls()  }, 1000);

        this.addKeyboardShortcut();
    }

    createControls() {
        const clip = this.clip;
        if (!clip.transformMesh){
            console.error(' Dont exist transformMesh for transformControls ');
        } else {
            const controls = this.controls;
            controls.attach( clip.transformMesh );
            clip.scene.add( controls );
            if(clip.controls){
                controls.addEventListener( 'dragging-changed', function ( event ) {
                    clip.controls.controls.enabled = ! event.value;
                } );
            }
            this.controls = controls;
        }
    }

    update(){
        if(this.clip.transformMesh){
            console.log(this.clip.transformMesh.position);
        }
    }

    addKeyboardShortcut() {
        const control = this.controls;
        window.addEventListener( 'keydown', function ( event ) {

            switch ( event.keyCode ) {

                case 81: // Q
                    control.setSpace( control.space === "local" ? "world" : "local" );
                    break;

                case 16: // Shift
                    control.setTranslationSnap( 100 );
                    control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                    control.setScaleSnap( 0.25 );
                    break;

                case 87: // W
                    control.setMode( "translate" );
                    break;

                case 69: // E
                    control.setMode( "rotate" );
                    break;

                case 82: // R
                    control.setMode( "scale" );
                    break;

                // case 67: // C
                //     const position = currentCamera.position.clone();

                //     currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
                //     currentCamera.position.copy( position );

                //     orbit.object = currentCamera;
                //     control.camera = currentCamera;

                //     currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
                //     onWindowResize();
                //     break;

                // case 86: // V
                //     const randomFoV = Math.random() + 0.1;
                //     const randomZoom = Math.random() + 0.1;

                //     cameraPersp.fov = randomFoV * 160;
                //     cameraOrtho.bottom = - randomFoV * 500;
                //     cameraOrtho.top = randomFoV * 500;

                //     cameraPersp.zoom = randomZoom * 5;
                //     cameraOrtho.zoom = randomZoom * 5;
                //     onWindowResize();
                //     break;

                case 187:
                case 107: // +, =, num+
                    control.setSize( control.size + 0.1 );
                    break;

                case 189:
                case 109: // -, _, num-
                    control.setSize( Math.max( control.size - 0.1, 0.1 ) );
                    break;

                case 88: // X
                    control.showX = ! control.showX;
                    break;

                case 89: // Y
                    control.showY = ! control.showY;
                    break;

                case 90: // Z
                    control.showZ = ! control.showZ;
                    break;

                case 32: // Spacebar
                    control.enabled = ! control.enabled;
                    break;

            }

        } );

        window.addEventListener( 'keyup', function ( event ) {

            switch ( event.keyCode ) {

                case 16: // Shift
                    control.setTranslationSnap( null );
                    control.setRotationSnap( null );
                    control.setScaleSnap( null );
                    break;

            }

        } );
    }


}

/* Codigo que no quiero borrar */
/*

addTransformControl() {
    //const control = new TransformControls( this.camera, this.renderer.domElement );
    //control.attach( plane );
    // const self = this;
    // control.addEventListener( 'dragging-changed', function ( event ) {
    //     self.controls.controls.enabled = ! event.value;
    // } );
    const control = new TransformControls( this.camera, this.renderer.domElement );
    this.gameObjectManager.gameObjects.forEach((gameObject) => {
        console.log(gameObject);
        if(gameObject.components.length != 0){
            const mesh = gameObject.components[0].mesh;
            control.attach(mesh);
        }else{
            //control.attach(gameObject.transform);
        }
    });
    // console.log(this.plane);
    // control.add(this.plane);
    // this.scene.add( control );

    
    //control.attach( meshArray[0] );
    this.scene.add(control);
    const self = this;
    control.addEventListener( 'dragging-changed', function ( event ) {
        self.controls.controls.enabled = ! event.value;
    } );
}

*/