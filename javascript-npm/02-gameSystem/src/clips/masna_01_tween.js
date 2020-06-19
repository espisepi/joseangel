import { EspinacoTweenUtilities } from '../espinacoTweenUtilities.js';
/*
    Esta clase modifica el objeto tweenManager anadiendole objetos tween
*/
export class Masna_01_Tween {

    constructor(tweenManager, objectsToAnimate){
        this.tweenManager = tweenManager;

        const cubeWireframeComponent = objectsToAnimate.cubeWireframeComponent;
        this.changeColorLoop(cubeWireframeComponent.cube.material.color, 3000);

    }
    
    changeColorLoop( color, time, timeMaxDuration ) {
        const self = this;
        const intervalId = setInterval(function(){
            EspinacoTweenUtilities.changeColor(self.tweenManager, color, time);
         }, time);

        if(timeMaxDuration){
            setTimeout(
                clearInterval,
                timeMaxDuration,
                intervalId
            );
        }
    }

}