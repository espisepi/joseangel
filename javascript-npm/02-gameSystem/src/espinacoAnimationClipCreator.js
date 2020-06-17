//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import * as THREE from '../../node_modules/three/build/three.module.js';
import {AnimationClipCreator} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/animation/AnimationClipCreator.js';

export class EspinacoAnimationClipCreator extends AnimationClipCreator{
    constructor(){
        super();
    }
    static CreateMaterialSimpleColorAnimation( duration, colors, attribute = '.material.color' ) {
        var times = [], values = [],
        timeStep = duration / colors.length;

        for ( var i = 0; i <= colors.length; i ++ ) {

            times.push( i * timeStep );
            values.push( colors[ i % colors.length ] );

        }

        var trackName = attribute;

        var track = new THREE.ColorKeyframeTrack( trackName, times, values );

        return new THREE.AnimationClip( null, duration, [ track ] );
    }
}