//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import * as THREE from '../../node_modules/three/build/three.module.js';

export class GameObject {
    constructor(parent, name) {
      this.name = name;
      this.components = [];
      this.transform = new THREE.Object3D();
      this.transform.name = name;
      parent.add(this.transform);
    }
    addComponent(ComponentType, ...args) {
      const component = new ComponentType(this, ...args);
      this.components.push(component);
      return component;
    }
    removeComponent(component) {
      removeArrayElement(this.components, component);
    }
    getComponent(ComponentType) {
      return this.components.find(c => c instanceof ComponentType);
    }
    update(globals) {
      for (const component of this.components) {
        component.update(globals);
      }
    }
  }