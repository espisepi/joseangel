import {Masna_00} from '../clips/masna_00.js';
import { Transition } from '../transitions/transition.js';
import { Masna_01 } from '../clips/masna_01.js';

export class Film0 {
    constructor(renderer, withControls, globals) {
        const clip = new Masna_00(renderer, true, globals);
        const clip2 = new Masna_01(renderer, true, globals);
        this.transition = new Transition(renderer, clip, clip2);
        this.transition.setTransition(1.0);
        // camera of this clip will update when resize
        this.clip = clip;
        
    }

    update(time) {
        //this.clip.update(time);
        this.transition.render();
    }
    
}