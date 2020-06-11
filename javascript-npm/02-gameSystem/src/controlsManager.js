import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import {DeviceOrientationControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/DeviceOrientationControls.js';

export class ControlsManager {
    constructor( nameControl, camera, canvas ) {
        this.camera = camera;
        this.canvas = canvas;
        this.setControl(nameControl);
    }
    setControl(nameControl) {
        if( nameControl === 'orbitControls' ) {
            this.controls = new OrbitControls(this.camera, this.canvas);
        }
        if( nameControl === 'deviceOrientationControls' ) {
            this.controls = new DeviceOrientationControls(this.camera);
        }
    }
    update() {
        this.controls.update();
    }
}