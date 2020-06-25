import {OrbitControls} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {DeviceOrientationControls} from '../../node_modules/three/examples/jsm/controls/DeviceOrientationControls.js';
import {FirstPersonControls} from '../../node_modules/three/examples/jsm/controls/FirstPersonControls.js';
import {FlyControls} from '../../node_modules/three/examples/jsm/controls/FlyControls.js';

export class ControlsManager {
    constructor( nameControl, camera, canvas ) {
        this.camera = camera;
        this.canvas = canvas;
        this.setControl(nameControl);
    }
    setControl(nameControl) {
        if( nameControl === 'orbitControls' ) {
            this._createOrbitControls();
        }
        if( nameControl === 'orbitControlsZoom' ) {
            this._createOrbitControlsZoom();
        }
        if( nameControl === 'deviceOrientationControls' ) {
            this._createDeviceOrientationControls();
        }
        if( nameControl === 'firstPersonControls' ) {
            this._createFirstPersonControls();
        }
        if( nameControl === 'flyControls' ) {
            this._createFlyControls();
        }
        
    }
    update(deltaTime) {
        if(this.controls.update){
            if(this.controls.movementSpeed){
                this.controls.movementSpeed = 0.33 ;
            }
            this.controls.update(deltaTime);

            if(this.automaticZoomOrbitControls) {
                let position = this.controls.object.position;
                const zoomFrontal = 4;
                const zoomLateral = 8;
                if(Math.abs(position.x) < 3 ){
                    console.log('dentro');
                    if(Math.sign(position.z) === 1){
                        position.z = zoomFrontal;
                        // if(position.z < zoomFrontal){
                        //     position.z += 0.1;
                        // }else{
                        //     position.z = zoomFrontal;
                        // }
                    }else{
                        position.z = -zoomFrontal;
                        // if(position.z > -zoomFrontal) {
                        //     position.z -= 0.1;
                        // }else{
                        //     position.z = -zoomFrontal;
                        // }
                    }
                    
                }else{
                    // if(Math.sign(position.x) === 1){
                    //     position.z = zoomLateral;
                    // }else{
                    //     position.z = -zoomLateral;
                    // }
                }
            }
        }
    }

    /* Metodos para crear controls */
    _createOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
    }
    _createOrbitControlsZoom() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.maxPolarAngle = Math.PI / 2.5;
        this.controls.minPolarAngle = Math.PI / 4;
        this.automaticZoomOrbitControls = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.07;
    }
    _createDeviceOrientationControls() {
        this.controls = new DeviceOrientationControls(this.camera);
    }
    _createFirstPersonControls() {
        this.controls = new FirstPersonControls( this.camera, this.canvas );
        this.controls.movementSpeed = 1000;
        this.controls.lookSpeed = 0.1;
        this.controls.enabled = false;
        const joystick = new VirtualJoystick({
            mouseSupport: true,
        });
        // joystick._baseEl.style.display = 'block';
        // joystick._baseEl.style.top = '0px';
        console.log(joystick);
    }
    _createFlyControls() {
        this.controls = new FlyControls(this.camera, this.canvas);
        const controls = this.controls;
        controls.movementSpeed = 0.5;
        controls.rollSpeed = Math.PI / 24; //Math.PI / 24
        controls.autoForward = false;
        controls.dragToLook = false;
    }
}