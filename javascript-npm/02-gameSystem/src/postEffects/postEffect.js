import { EffectComposer } from '../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../../../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';

export class PostEffect {
    
    constructor(renderer, clip) {
        this.renderer = renderer;
        this.clip = clip;
        this.composer = new EffectComposer( renderer );
        this.composer.addPass( new RenderPass( clip.scene, clip.camera ) );

        const glitchPass = new GlitchPass();
        this.composer.addPass( glitchPass );
    }

    render() {
        this.clip.update();
        this.composer.render();
    }

    resize() {
        this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height );
    }
}