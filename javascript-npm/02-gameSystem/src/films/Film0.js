import { Transition } from '../transitions/transition.js';
import { Masna_00 } from '../clips/masna_00.js';
import {Masna_01} from '../clips/masna_01.js';
import { PostEffect } from '../postEffects/postEffect.js';

export class Film0 {
    constructor(renderer, globals) {
        this.renderer = renderer;

        // Decir por parametro el tipo de control de la escena
        const params = {
            globals: globals,
            controls: 'orbitControls'
        };
        const clip = new Masna_00(renderer, {globals: globals});
        const clip2 = new Masna_01(renderer, params);
        this.transition = new Transition(renderer, clip, clip2);
        this.transition.setTransition(0.0);
        // camera of this clip will update when resize
        this.clip = clip;

        this.postEffects = new PostEffect(renderer,this.clip);
        
    }
    
    render() {
        this.transition.render();
        //this.postEffects.render();
         //this.clip.update();
         //this.clip.render();
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