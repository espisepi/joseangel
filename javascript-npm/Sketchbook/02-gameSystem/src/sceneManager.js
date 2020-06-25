import {Film0} from './films/Film0.js';
import {Film1} from './films/Film1.js';

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
        this.addKeyboardShortcut();
        
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

    addKeyboardShortcut() {
        const self = this;
        window.addEventListener( 'keydown', function ( event ) {
            console.log(event);
            switch( event.keyCode ) {
                case 49: // key 1
                    self.film = new Film0(self.renderer, self.globals);
                    break;
                case 50: // key 2
                    self.film = new Film1(self.renderer, self.globals);
                    break;
            }
        });
    }

}