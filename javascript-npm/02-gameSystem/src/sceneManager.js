import {Clip0} from './clips/clip0.js';
import {Clip1} from './clips/clip1.js';
import { Transition } from './transitions/transition.js';

export class SceneManager {
    // Aqui es donde interactuamos con las escenas
    // para el crossfade postprocessing
    constructor(renderer, withControls = true) {
        this.renderer = renderer;
        this.withControls = withControls;
        this.globals = {
            time: 0.0,
            deltaTime: 0.0
        }
        this.clip = new Clip1(this.renderer, this.withControls, this.globals);
        this.clip2 = new Clip0(this.renderer, this.withControls, this.globals);
        this.transition = new Transition(renderer, this.clip, this.clip2);
        this.transition.setTransition(0.2);
    }

    update(time) {

        // convert to seconds
        this.globals.time = time * 0.001;
        // make sure delta time isn't too big.
        this.globals.deltaTime = Math.min(this.globals.time - this.then, 1 / 20);
        this.then = this.globals.time;

        this.transition.render();
    }

}