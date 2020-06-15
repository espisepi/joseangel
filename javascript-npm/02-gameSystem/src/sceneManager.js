import {Clip0} from './clips/clip0.js';
import {Clip1} from './clips/clip1.js';

export class SceneManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.setClip(0);
    }
    setClip(number) {
        if(number === 0){
            this.clip = new Clip1(this.renderer);
        }
    }
    update(time) {
        this.clip.update(time);
    }

}