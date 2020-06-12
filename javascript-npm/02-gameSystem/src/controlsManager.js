import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import {DeviceOrientationControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/DeviceOrientationControls.js';
import {FirstPersonControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/FirstPersonControls.js';

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
        if( nameControl === 'firstPersonControls' ) {
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
    setDeltaTime(deltaTime) {
        this.deltaTime = deltaTime;
    }
    update() {
        if(this.deltaTime){
            this.controls.update(this.deltaTime);
        }else{
            this.controls.update();
        }
    }
}