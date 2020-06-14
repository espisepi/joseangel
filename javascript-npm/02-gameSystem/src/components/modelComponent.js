import{Component} from './component.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {FiniteStateMachine} from '../finiteStateMachine.js';
import {SkinInstance} from '../skinInstance.js';
import {EspinacoAnimationClipCreator} from '../espinacoAnimationClipCreator.js';

export class ModelComponent extends Component{

	constructor(gameObject, model, deltaTime) {
		super(gameObject);

		/* 
		   SkinInstance has the method gameObject.transform.add(this.animRoot);
		   to add the model to the scene, so we dont need to add it in this class
		*/
		const skinInstance = gameObject.addComponent(SkinInstance, model, deltaTime);
		skinInstance.mixer.timeScale = 1.0;
		this.skinInstance = skinInstance;
	}

	update() {
	}
}