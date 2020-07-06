import * as THREE from '../../node_modules/three/build/three.module.js';

AFRAME.registerComponent('equirectangular', {
    schema: {
        src: {},
    },
    init: function() {
        const self = this;        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const body = document.querySelector('body')
        body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = ctx;

        const cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget( 256, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
        const cubeCamera1 = new THREE.CubeCamera( 1, 1000, cubeRenderTarget1 );
        this.el.object3D.add( cubeCamera1 );
        this.cubeCamera1 = cubeCamera1;
        this.cubeRenderTarget1 = cubeRenderTarget1;

        // Ocultamos la escena principal
        // const div = document.querySelector('#divScene');
        // div.style.display = "none";

        this.plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2,2,2),
            new THREE.MeshBasicMaterial({map: cubeRenderTarget1.texture})
        );
        this.el.object3D.add(this.plane);
    },

    tick: function(time, deltatime) {
        if(this.el.renderer){
            this.cubeCamera1.update( this.el.renderer, this.el.object3D );
            this.plane.material.map = this.cubeRenderTarget1.texture;
        }
        
        
    }
});