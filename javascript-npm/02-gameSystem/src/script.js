import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/utils/SkeletonUtils.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

import {GameObject} from './gameObject.js';
import {GameObjectManager} from './gameObjectManager.js';
import {ModelComponent} from './components/modelComponent.js';
import { ControlsManager } from './controlsManager.js';
import { Photos360 } from './photos360.js';

import { HorseModelComponent } from './components/videoclip0/horseModelComponent.js';
import { TweenManager } from './tweenManager.js';
import { SceneManager } from './sceneManager.js';


function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const sceneManager = new SceneManager(renderer);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    const camera = sceneManager.clip.camera;
    const scene = sceneManager.clip.scene;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    sceneManager.update(time);
  	renderer.render(scene,camera);

  	requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/* MAIN PRINCIPAL */
let btn = document.getElementById('btn-iniciar');
//btn.addEventListener('click', () => {
  let overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  main();
//});