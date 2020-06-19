import {Film0} from './films/Film0.js';
//import {Film1} from './films/Film1.js';

export class SceneManager {
    // Aqui es donde interactuamos con las escenas
    // para el crossfade postprocessing
    constructor(renderer) {
        this.renderer = renderer;
        this.globals = {
            time: 0.0,
            deltaTime: 0.0
        }
        this.then = 0.0;
        this.film = new Film0(this.renderer, this.globals);
        //this.film = new Film1(this.renderer, this.globals);
        
    }
    resizeRenderer(){
        this.film.resize();
    }

    render(time) {

        // convert to seconds
        this.globals.time = time * 0.001;
        // make sure delta time isn't too big.
        this.globals.deltaTime = Math.min(this.globals.time - this.then, 1 / 20);
        this.then = this.globals.time;

        this.film.render();
    }

}