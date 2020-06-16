import {Clip0} from './clips/clip0.js';
import {Clip1} from './clips/clip1.js';

export class SceneManager {
    // Aqui es donde interactuamos con las escenas
    // para el crossfade postprocessing
    constructor(renderer, withControls = true) {
        this.renderer = renderer;
        this.withControls = withControls;
        //this.clip = new Clip1(this.renderer, this.withControls);
        this.clip = new Clip1(this.renderer, this.withControls);
    }

    update(time) {
        this.clip.update(time);
    }

}