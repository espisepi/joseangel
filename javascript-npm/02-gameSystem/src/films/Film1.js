import { Dirty } from '../clips/dirty.js';

export class Film1 {
    constructor(renderer, globals) {
        this.renderer = renderer;
        const params = {
            globals: globals,
            controls: 'orbitControls'
        };
        const clip = new Dirty(renderer, params);
        this.clip = clip;

        //this.transition = new Transition(renderer, clip, clip2);
        //this.transition.setTransition(0.0);
        //this.postEffects = new PostEffect(renderer,this.clip);
        
    }
    
    render() {
        //this.transition.render();
        //this.postEffects.render();
         this.clip.update();
         this.clip.render();
    }

    resize() {
        const canvas = this.renderer.domElement;
        this.clip.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.clip.camera.updateProjectionMatrix();
        if(this.postEffects) {
            this.postEffects.resize();
        }
    }
    
}