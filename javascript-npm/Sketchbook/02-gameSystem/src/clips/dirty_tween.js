import { EspinacoTweenUtilities } from '../espinacoTweenUtilities.js';

export class Dirty_tween {
    constructor(params) {
        const [tweenManager, sphereMusic] = Object.values(params);
        this.tweenManager = tweenManager;

        //this.changeColorLoop(sphereMusic, 8000);
    }

    changeColorLoop( sphereMusic, time, timeMaxDuration ) {
        const self = this;
        const intervalId = setInterval(function(){
            EspinacoTweenUtilities.changeColor(self.tweenManager, sphereMusic.material.color, time);
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