import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';

/* Propiedades de transition

this.scene : La escena de la transition (el plano ocupando la pantalla con ShaderMaterial)
this.cameraOrtho: La camara de la transition
this.scenes: Las escenas que se van a mostrar con la transicion
this.renderer: El renderer creado en script.js

this.quadMaterial: El ShaderMaterial del plano (la responsable de la transicion)
this.quad: El mesh del plano de la transicion


*/
export class Transition {
    constructor(renderer,...scenes) {
        this.renderer = renderer;
        this.scenes = [...scenes];
        this.createTransition();
    }

    createTransition() {
        this.scene = new THREE.Scene();

        this.cameraOrtho = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10, 10 );

        this.textures = [];

        const loader = new THREE.TextureLoader();

        for ( let i = 0; i < 6; i ++ ) {
            this.textures[ i ] = loader.load( '../../../assets/textures/transition/transition' + ( i + 1 ) + '.png' );
        }

        this.quadmaterial = new THREE.ShaderMaterial( {

            uniforms: {

                tDiffuse1: {
                    value: null
                },
                tDiffuse2: {
                    value: null
                },
                mixRatio: {
                    value: 0.0
                },
                threshold: {
                    value: 0.1
                },
                useTexture: {
                    value: 1
                },
                tMixTexture: {
                    value: this.textures[ 0 ]
                }
            },
            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = vec2( uv.x, uv.y );",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join( "\n" ),
            fragmentShader: [

                "uniform float mixRatio;",

                "uniform sampler2D tDiffuse1;",
                "uniform sampler2D tDiffuse2;",
                "uniform sampler2D tMixTexture;",

                "uniform int useTexture;",
                "uniform float threshold;",

                "varying vec2 vUv;",

                "void main() {",

                "	vec4 texel1 = texture2D( tDiffuse1, vUv );",
                "	vec4 texel2 = texture2D( tDiffuse2, vUv );",

                "	if (useTexture==1) {",

                "		vec4 transitionTexel = texture2D( tMixTexture, vUv );",
                "		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
                "		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",

                "		gl_FragColor = mix( texel1, texel2, mixf );",

                "	} else {",

                "		gl_FragColor = mix( texel2, texel1, mixRatio );",

                "	}",

                "}"

            ].join( "\n" )

        } );

        const quadgeometry = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );

        this.quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
        //this.quad = new THREE.Mesh( quadgeometry, new THREE.MeshBasicMaterial({color:0x400000}) );
        this.scene.add( this.quad );
        // Link both scenes and their FBOs
        const sceneA = this.scenes[0];
        const sceneB = this.scenes[1];

        this.quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
        this.quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;

        this.needChange = false;
        
    }

    render() {
        // Prevent render both scenes when it's not necessary
        // if ( transitionParams.transition == 0 ) {

        //     this.sceneB.render( delta, false );

        // } else if ( transitionParams.transition == 1 ) {

        //     this.sceneA.render( delta, false );

        // } else {

            // When 0<transition<1 render transition between two scenes
            const renderer = this.renderer;
            this.scenes[0].render(  true );
            this.scenes[1].render(  true );
            renderer.setRenderTarget( null );
            renderer.clear();
            renderer.render( this.scene, this.cameraOrtho );

            this.quadmaterial.uniforms.mixRatio.value = 0.29;

        // }

    }
    
}