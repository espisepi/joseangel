import {Clip0} from './clips/clip0.js';
import {Clip1} from './clips/clip1.js';

export class SceneManager {
    // Aqui es donde interactuamos con las escenas
    // para el crossfade postprocessing
    constructor(renderer, withControls = true) {
        this.renderer = renderer;
        this.withControls = withControls;
        this.setClip(0);
    }
    setClip(number) {
        if(number === 0){
            this.clip = new Clip1(this.renderer, this.withControls);
        }
    }
    update(time) {
        this.clip.update(time);
    }

}