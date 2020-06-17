//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import * as THREE from '../../node_modules/three/build/three.module.js';
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

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      sceneManager.clip.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      sceneManager.clip.camera.updateProjectionMatrix();
    }
    
    sceneManager.update(time);

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