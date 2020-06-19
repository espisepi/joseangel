import {Clip0} from '../clips/clip0.js';
import {Clip1} from '../clips/clip1.js';
import { Transition } from '../transitions/transition.js';
import { Clip2 } from '../clips/clip2.js';

export class Film0 {
    constructor(renderer, withControls, globals) {
        const clip = new Clip1(renderer, true, globals);
        const clip2 = new Clip2(renderer, true, globals);
        this.transition = new Transition(renderer, clip, clip2);
        this.transition.setTransition(0.0);
        // to resizeRenderer method
        this.clip = clip;
    }

    update(time) {
        this.transition.render();
    }
}