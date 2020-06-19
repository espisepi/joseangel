import { Transition } from '../transitions/transition.js';
import { Masna_00 } from '../clips/masna_00.js';
import {Masna_01} from '../clips/masna_01.js';

export class Film0 {
    constructor(renderer, withControls, globals) {

        const loadingElem = document.querySelector('#loading');
        loadingElem.style.display = 'none';

        // Decir por parametro el tipo de control de la escena
        const params = {
            globals: globals,
            //controls: 'orbitControls'
        };
        const clip = new Masna_00(renderer, params);
        const clip2 = new Masna_01(renderer, params);
        this.transition = new Transition(renderer, clip, clip2);
        this.transition.setTransition(0.0);
        // camera of this clip will update when resize
        this.clip = clip2;
        
    }

    update(time) {
        this.transition.render();
        // this.clip.update();
        // this.clip.render();
    }
    
}