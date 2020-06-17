import { ModelComponent } from '../modelComponent.js';
import { EspinacoAnimationClipCreator } from '../../espinacoAnimationClipCreator.js';

export class HorseModelComponent extends ModelComponent {
    constructor(gameObject, model, deltaTime, tweenManager) {
        super(gameObject, model, deltaTime);
        this.createAnimations();
        this.createTweenAnimations(tweenManager);
        //this.skinInstance.setAnimation('Visibility');

        this.skinInstance.animRoot.scale.set(0.2,0.2,0.2);
        //this.skinInstance.animRoot.position.set(new THREE.Vector3(0,0,0));
    }
    update(){
        super.update();
    }
    createTweenAnimations(tweenManager) {

        // tweenManager.createTween(this.skinInstance.animRoot.position)
        //     .to({x:0.0,y:0.0,z:-400.0}, 3000)
        //     .delay(2000)
        //     .start();
        // tweenManager.createTween(this.skinInstance.animRoot.rotation)
        //     .to({x:0.0,y:-2.0,z:0.0}, 1000)
        //     .start();
        
        const model = this.skinInstance.model;
        tweenManager.createTween({r:0.0,g:0.0,b:1.0})
            .to({
                    r: [1.0, 0.0],
                    g: [0.0, 1.0],
                    b: [0.0, 0.0]
                },
                3000)
            .onUpdate(function(){
                model.gltf.scene.traverse((child)=>{
                    if(child.isMesh){
                        child.material.color = this._object ;
                    }
                });
            })
            .start();
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
