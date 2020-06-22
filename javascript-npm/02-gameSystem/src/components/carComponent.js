import { Component } from "./component.js";
import * as THREE from '../../../node_modules/three/build/three.module.js';


export class CarComponent extends Component {
    constructor(gameObject, model, globals) {
        super(gameObject);
        this.globals = globals;
        this.model = model.loader;
        this.ferrariGtlf();
        
    }

    ferrariGtlf() {
        const carModel = this.model.scene.children[0];
        this.wheels = [];
        this.wheels.push(
            carModel.getObjectByName( 'wheel_fl' ),
            carModel.getObjectByName( 'wheel_fr' ),
            carModel.getObjectByName( 'wheel_rl' ),
            carModel.getObjectByName( 'wheel_rr' )
        );
        this.model = carModel;
        this.gameObject.transform.add(this.model);
    }

    audiR8() {
        const self = this;
        //wheels[ i ].rotation.x = time * Math.PI;
        this.model.children.forEach(mesh => {
        console.log(this.model.children);
        //for(let mesh of this.model.children){
            mesh.material = new THREE.MeshBasicMaterial({color: 0xff00000, wireframe: true});
            // if(mesh.name === 'Cube.046'){
            //     //mesh.material = new THREE.MeshBasicMaterial({color: 0xff00000});
            // }
            // if(mesh.name === 'teker001') {
            //     mesh.scale.set(1,1,1);
            //     mesh.material = new THREE.MeshBasicMaterial({color: 0x00f0f0, wireframe: true});
            //     this.wheels = mesh;
            // }
            self.gameObject.transform.add(mesh);
        //}
        });
    }

    update() {
        if(this.wheels) {
            this.wheels.forEach(wheel => {
                wheel.rotation.x = - this.globals.time * Math.PI;
            });
        }
    }
}