import {Component} from './components/component.js';
import * as THREE from '../../node_modules/three/build/three.module.js';
import {SkeletonUtils} from '../../node_modules/three/examples/jsm/utils/SkeletonUtils.js';

export class SkinInstance extends Component {
    constructor(gameObject, model, deltaTime) {
      super(gameObject);
      this.model = model;
      this.deltaTime = deltaTime;
      this.animRoot = SkeletonUtils.clone(this.model.gltf.scene);
      this.mixer = new THREE.AnimationMixer(this.animRoot);
      gameObject.transform.add(this.animRoot);
      this.actions = {};
    }
    setAnimation(animName) {
      const clip = this.model.animations[animName];
      // turn off all current actions
      for (const action of Object.values(this.actions)) {
        action.enabled = false;
      }
      // get or create existing action for clip
      const action = this.mixer.clipAction(clip);
      action.enabled = true;
      action.reset();
      action.play();
      this.actions[animName] = action;
    }
    update() {
      this.mixer.update(this.deltaTime);
    }
  }