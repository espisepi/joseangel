import {Clip0} from './clips/clip0.js';
import {Clip1} from './clips/clip1.js';
import { Transition } from './transitions/transition.js';

export class SceneManager {
    // Aqui es donde interactuamos con las escenas
    // para el crossfade postprocessing
    constructor(renderer, withControls = true) {
        this.renderer = renderer;
        this.withControls = withControls;
        //this.clip = new Clip1(this.renderer, this.withControls);
        this.clip = new Clip1(this.renderer, this.withControls);
        this.clip2 = new Clip0(this.renderer, this.withControls);
        this.transition = new Transition(renderer, this.clip, this.clip2);
        this.transition.setTransition(0.2);
    }

    update(time) {
        this.clip.update(time);
        this.transition.render();
        // Renderizamos en Transition
        //this.clip.render();
    }

}