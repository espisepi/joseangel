import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/libs/dat.gui.module.js';
/*  Propiedades de transition
    this.scene : La escena de la transition (el plano ocupando la pantalla con ShaderMaterial)
    this.cameraOrtho: La camara de la transition
    this.scenes: Las escenas que se van a mostrar con la transicion
    this.renderer: El renderer creado en script.js

    this.quadMaterial: El ShaderMaterial del plano (la responsable de la transicion)
    this.quad: El mesh del plano de la transicion

    Metodos:
    setTransition(value)
    setTextureThreshold(value)
    useTexture(boolean)
    setTexture(indice)
    setSceneA(scene)
    setSceneB(scene)
*/
export class Transition {
    constructor(renderer,...scenes) {
        this.renderer = renderer;
        this.scenes = [...scenes];
        this.createTransition();
        this.updateTextures();
        this.createTransitionParams();
        //this.initGUI();
        this.clock = new THREE.Clock();
    }
    setSceneA(scene) {
        this.scenes[0] = scene;
        this.updateTextures();
    }
    setSceneB(scene) {
        this.scenes[1] = scene;
        this.updateTextures();
    }
    setTransition( value ) {
        //this.quadmaterial.uniforms.mixRatio.value // no funciona no se por que
        this.transitionParams.transition = value;
    }
    setTextureThreshold( value ) {
        this.quadmaterial.uniforms.threshold.value = value;
    };
    useTexture( value ) {
        this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
    };

    setTexture = function ( i ) {
        this.quadmaterial.uniforms.tMixTexture.value = this.textures[ i ];
    };
    initGUI() {
        const transitionParams = this.transitionParams;
        const gui = new GUI();
        const self = this;
        gui.add( transitionParams, "useTexture" ).onChange( function ( value ) {
            self.useTexture( value );
        } );

        gui.add( transitionParams, 'loopTexture' );

        gui.add( transitionParams, 'texture', { Perlin: 0, Squares: 1, Cells: 2, Distort: 3, Gradient: 4, Radial: 5 } ).onChange( function ( value ) {
            self.setTexture( value );
        } ).listen();

        gui.add( transitionParams, "textureThreshold", 0, 1, 0.01 ).onChange( function ( value ) {
            self.setTextureThreshold( value );
        } );

        gui.add( transitionParams, "animateTransition" );
        gui.add( transitionParams, "transition", 0, 1, 0.01 ).listen();
        gui.add( transitionParams, "transitionSpeed", 0.5, 5, 0.01 );
    }

    createTransitionParams() {
        this.transitionParams = {
            "useTexture": true,
            "transition": 0.5,
            "transitionSpeed": 2.0,
            "texture": 5,
            "loopTexture": true,
            "animateTransition": false,
            "textureThreshold": 0.3
        };
    }

    updateTextures() {
        // Link both scenes and their FBOs
        const sceneA = this.scenes[0];
        const sceneB = this.scenes[1];

        this.quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
        this.quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;

        this.needChange = false;
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
        this.scene.add( this.quad );
        
    }

    render(time) {
        
        const transitionParams = this.transitionParams;
        const renderer = this.renderer;
        const sceneA = this.scenes[0];
        const sceneB = this.scenes[1];

        if ( transitionParams.animateTransition ) {
            this.animateTransition();
        }

        this.quadmaterial.uniforms.mixRatio.value = transitionParams.transition;

        // Prevent render both scenes when it's not necessary
        if ( transitionParams.transition == 0 ) {

            sceneB.render( false );

        } else if ( transitionParams.transition == 1 ) {

            sceneA.render( false );

        } else {

            // When 0<transition<1 render transition between two scenes

            sceneA.render( true );
            sceneB.render( true );
            renderer.setRenderTarget( null );
            renderer.clear();
            renderer.render( this.scene, this.cameraOrtho );

        }


    }

    animateTransition() {
        const transitionParams = this.transitionParams;
        var t = ( 1 + Math.sin( transitionParams.transitionSpeed * this.clock.getElapsedTime() / Math.PI ) ) / 2;
            transitionParams.transition = THREE.MathUtils.smoothstep( t, 0.3, 0.7 );

            // Change the current alpha texture after each transition
            if ( transitionParams.loopTexture && ( transitionParams.transition == 0 || transitionParams.transition == 1 ) ) {

                if ( this.needChange ) {

                    transitionParams.texture = ( transitionParams.texture + 1 ) % this.textures.length;
                    this.quadmaterial.uniforms.tMixTexture.value = this.textures[ transitionParams.texture ];
                    this.needChange = false;

                }

            } else
                this.needChange = true;

    }
    
}