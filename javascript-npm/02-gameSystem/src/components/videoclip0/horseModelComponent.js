import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import { ModelComponent } from '../modelComponent.js';
import { EspinacoAnimationClipCreator } from '../../espinacoAnimationClipCreator.js';

export class HorseModelComponent extends ModelComponent {
    constructor(gameObject, model, deltaTime) {
        super(gameObject, model, deltaTime);
        this.createAnimations();
        this.skinInstance.setAnimation('Visibility');

        this.skinInstance.animRoot.scale.set(0.2,0.2,0.2);
    }
    update(){
        super.update();
    }
    createAnimations() {
        /* Aqui creamos las nuevas animaciones */
        this.createAnimationVisibility();
        this.createAnimationColors();
    }
    createAnimationVisibility() {
        const name = 'Visibility';
		const visibilityAnimation = EspinacoAnimationClipCreator.CreateVisibilityAnimation( 2 );
		visibilityAnimation.name = name;
		this.skinInstance.model.animations[name] = visibilityAnimation;
    }
    createAnimationColors() {
        const name = 'Colors';
        console.log(this.skinInstance);
        const colorAnimation = EspinacoAnimationClipCreator.CreateMaterialSimpleColorAnimation(3,[1,1,0,0,0,1,1,0,0],'.material[0]');
        colorAnimation.name = name;
        this.skinInstance.model.animations[name] = colorAnimation;
    }
}
