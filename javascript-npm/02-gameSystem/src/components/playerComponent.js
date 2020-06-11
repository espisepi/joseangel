import{Component} from '../component.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {FiniteStateMachine} from '../finiteStateMachine.js';
import {SkinInstance} from '../skinInstance.js';

export class PlayerComponent extends Component{

	constructor(gameObject, model, deltaTime) {
		super(gameObject);

		/* 
		   SkinInstance has the method gameObject.transform.add(this.animRoot);
		   to add the model to the scene, so we dont need to add it in this class
		*/
		const skinInstance = gameObject.addComponent(SkinInstance, model, deltaTime);
		skinInstance.mixer.timeScale = 1.0;
		skinInstance.setAnimation('Jump');

		console.log(this.skinInstance);



		let cont = 0;
		this.fsm = new FiniteStateMachine({
			state0: {
				enter: () => {
					console.log('entra en state0');
				},
				update: () => {
					cont++;
					if(cont == 100){
						cont = 0;
						this.fsm.transition('state1');
					}
				}
			},
			state1: {
				enter: () => {
					console.log('entra en state1');
				},
				update: () => {
					cont++;
					if(cont == 100) {
						cont = 0;
						this.fsm.transition('state0');
					}
				}
			}
		},
		'state0');
	}

	update() {
		//this.fsm.update();
	}
}