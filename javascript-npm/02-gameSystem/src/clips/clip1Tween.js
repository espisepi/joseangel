import { EspinacoTweenUtilities } from '../espinacoTweenUtilities.js';
/*
    Esta clase modifica el objeto tweenManager anadiendole objetos tween
*/
export class Clip1Tween {

    constructor(tweenManager, objectsToAnimate){
        this.tweenManager = tweenManager;

        const cubeWireframeComponent = objectsToAnimate.cubeWireframeComponent;
        this.changeColorLoop('colorCubeWireframe',cubeWireframeComponent.cube.material.color, 1000);

    }
    changeColorLoop( nameInterval, color, time ) {
        
        const self = this;
        const intervalId = setInterval(function(){
            EspinacoTweenUtilities.changeColor(self.tweenManager, color, time);
         }, 1000);

        setTimeout(
            clearInterval,
            5000,
            intervalId
            );
    }

}