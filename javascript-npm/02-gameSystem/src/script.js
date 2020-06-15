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

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 5);

  //const controls = new OrbitControls(camera, renderer.domElement);
  const controls = new ControlsManager('orbitControls', camera, renderer.domElement);
  //controls.enableKeys = true;
  //controls.target.set(0, 5, 0);
  //controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  scene.add(new THREE.Mesh( new THREE.BoxBufferGeometry(5,2,1),
                        new THREE.MeshBasicMaterial({color:0xff0000})
                      )
            )

  const photos360 = new Photos360(renderer, camera, scene);

  function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    scene.add(light.target);
  }
  addLight(5, 5, 2);
  addLight(-5, 5, 5);

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

  const sceneManager = new SceneManager(scene);
  function render(time) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    sceneManager.update(time);
    photos360.update(camera,scene);
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