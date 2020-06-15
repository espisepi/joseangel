import { EspinacoTweenUtilities } from '../espinacoTweenUtilities.js';
/*
    Esta clase modifica el objeto tweenManager anadiendole objetos tween
*/
export class Clip1Tween {

    constructor(tweenManager, objectsToAnimate){
        this.tweenManager = tweenManager;

        const cubeWireframeComponent = objectsToAnimate.cubeWireframeComponent;
        this.changeColorLoop(cubeWireframeComponent.cube.material.color, 1000);

    }
    changeColorLoop( color, time ) {
        const self = this;
        setInterval(function(){
            EspinacoTweenUtilities.changeColor(self.tweenManager, color, time);
         }, 1000);
    }
}