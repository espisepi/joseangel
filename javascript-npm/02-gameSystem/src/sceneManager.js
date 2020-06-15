import {Clip0} from './clip0.js';

export class SceneManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.setClip(0);
    }
    setClip(number) {
        if(number === 0){
            this.clip = new Clip0(this.renderer);
        }
    }
    update(time) {
        this.clip.update(time);
    }

}