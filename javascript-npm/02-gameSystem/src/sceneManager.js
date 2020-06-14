
import {TweenManager} from './tweenManager.js';
import {GameObjectManager} from './gameObjectManager.js';
import {HorseModelComponent} from './components/videoclip0/horseModelComponent.js';

export class SceneManager {
    constructor(scene,globals,models){
        
        this.gameObjectManager = new GameObjectManager();
        const gameObjectPlayer = this.gameObjectManager.createGameObject(scene, 'player');
        this.tweenManager = new TweenManager();
        const modelComponent = gameObjectPlayer.addComponent(HorseModelComponent,models["llama"],globals.deltaTime,this.tweenManager);

    }
    update(){
        this.tweenManager.update();
        this.gameObjectManager.update();
    }
}