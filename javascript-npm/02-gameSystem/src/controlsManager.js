//import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
//import {FirstPersonControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/FirstPersonControls.js';
//import {DeviceOrientationControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/DeviceOrientationControls.js';
import {OrbitControls} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {DeviceOrientationControls} from '../../node_modules/three/examples/jsm/controls/DeviceOrientationControls.js';
import {FirstPersonControls} from '../../node_modules/three/examples/jsm/controls/FirstPersonControls.js';

// Implementar PointerLockControls
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
        
    }
    update(deltaTime) {
        this.controls.update(deltaTime);
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
}