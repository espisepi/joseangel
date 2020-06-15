

export class EspinacoTweenUtilities {
    constructor() {

    }

    static changeColor( tweenManager, color, time, ) {
        const tween1 = tweenManager.createTween(color)
            .to({
                    r: [1.0, 0.0, 0.0],
                    g: [0.0, 0.0, 1.0],
                    b: [0.0, 1.0, 0.0]
                },
                time)
            .onUpdate(function(){
                color = this._object ;
            })
            .start();

    }
}