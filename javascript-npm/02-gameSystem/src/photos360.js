import {CubemapToEquirectangular} from '../../node_modules/three.cubemap-to-equirectangular/build/CubemapToEquirectangular.js';
//https://github.com/spite/THREE.CubemapToEquirectangular
// Probar el unmanaged a ver si asi no se congela mi canvas principal
export class Photos360 {
    constructor(renderer,camera,scene) {
        //console.log(CCapture);
        // this.renderer = renderer;
        // this.capturer360 = new CCapture({
        //     format: 'threesixty',
        //     display: true,
        //     autoSaveTime: 3,
        //     equiManaged: new CubemapToEquirectangular(renderer, true,"4K"),
        //     camera: camera,
        //     scene: scene,
        // });
        this.camera = camera;
        this.scene = scene;
        this.equiManaged = new CubemapToEquirectangular( renderer, true ) ;
        this.setupControls();
    
    }
    update(camera,scene) {
        //this.equiManaged.update( camera, scene );
    }
    setupControls() {
        const camera = this.camera;
        const scene = this.scene;
        const equiManaged = this.equiManaged;
        // document.body.addEventListener('keypress', function (event) {
        //     if(event.key === 's'){
        //         console.log('start');
        //         equiManaged.update( camera, scene );
        //     }
        // });
    }
} 