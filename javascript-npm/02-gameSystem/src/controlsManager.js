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
        }
    }

    /* Metodos para crear controls */
    _createOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
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
        // controls.domElement = this.canvas;
        controls.rollSpeed = Math.PI / 24; //Math.PI / 24
        controls.autoForward = false;
        controls.dragToLook = true;
        console.log(controls);
    }
}