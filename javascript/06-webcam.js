import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from './js/three.js/examples/jsm/geometries/DecalGeometry.js';

let scene, renderer, camera, clock, width, height, video;
let particles, videoWidth, videoHeight, imageCache;

const particleIndexArray = [];

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const classNameForLoading = "loading";

let uniforms = {
    time: {
        type: 'f',
        value: 0.0
    },
    size: {
        type: 'f',
        value: 10.0
    }
};

// audio
let audio, analyser;
const fftSize = 2048;  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const frequencyRange = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
};

const init = () => {
    document.body.classList.add(classNameForLoading);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d40f8);

    renderer = new THREE.WebGLRenderer();
    document.getElementById("content").appendChild(renderer.domElement);

    clock = new THREE.Clock();

    initCamera();

    onResize();

    // navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
    //     getUserMedia: (c) => {
    //         return new Promise(function (y, n) {
    //             (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, y, n);
    //         });
    //     }
    // } : null);

    if (navigator.mediaDevices) {
        initAudio();
        initVideo();
    } else {
        showAlert();
    }

    draw();
};

const initCamera = () => {
    const fov = 45;
    const aspect = width / height;

    camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 10000);
    camera.position.set(0, 0, 900);
    camera.lookAt(0, 0, 0);

    scene.add(camera);
};

const initVideo = () => {
    video = document.getElementById("video");
    video.autoplay = true;

    const option = {
        video: true,
        audio: false
    };
    navigator.mediaDevices.getUserMedia(option)
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => {
                videoWidth = video.videoWidth;
                videoHeight = video.videoHeight;

                createParticles();
            });
        })
        .catch((error) => {
            console.log(error);
            showAlert();
        });
};

const initAudio = () => {
    const audioListener = new THREE.AudioListener();
    audio = new THREE.Audio(audioListener);

    const audioLoader = new THREE.AudioLoader();
    // https://www.newgrounds.com/audio/listen/872056
    audioLoader.load('asset/872056_Above-the-clouds.mp3', (buffer) => {
        document.body.classList.remove(classNameForLoading);

        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0.5);
        audio.play();
    });

    analyser = new THREE.AudioAnalyser(audio, fftSize);

    document.body.addEventListener('click', function () {
        if (audio) {
            if (audio.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
    });
};

// from https://stackoverflow.com/a/5624139
const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    };
};

const createParticles = () => {
    const imageData = getImageData(video);
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const vertices = [];
    const colors = [];

    let colorsPerFace = [
        "#ff4b78", "#16e36d", "#162cf8", "#2016e3"
    ];

    let count = 0;
    const step = 3;
    /** 
    * Se salta en cada iteracion 3 pixeles para que no se
    * sobrecargue la imagen dibujando un punto por cada pixel
    * en este caso dibujamos 1 punto por cada 3 pixels
    * -------------------------------------------------------
    * x,y posicion del pixel a leer
    * por cada pixel tenemos 4 valores (r,g,b,a)
    */
    for (let y = 0, height = imageData.height; y < height; y += step) {
        for (let x = 0, width = imageData.width; x < width; x += step) {
            // let index = (count) * 4 * step;
            let index = (x + y * width) * 4;
            /**
            * particleIndexArray = [0,4,8,12...]
            * cada valor indica el comienzo de un pixel nuevo
            * en concreto apunta al valor red de un pixel nuevo
            * [r,g,b,a,r,g,b,a,r,g,b,a,r,g,b,a...]
            * pixel0 = r(0), g(1), b(2), a(3)
              pixel1 = r(4), g(5), b(6), a(7)
              pixel2 = r(8), g(9), b(10), a(11)
              ...
            * Si no se cumple lo predicado, poner la variable step = 1
            */
            particleIndexArray.push(index);
            /**
            * [r,g,b,a,r,g,b,a,r,g,b,a,r,g,b,a...]
            * r(0)-> 0 - 255   index (1ª iteracion)
            * g(1)-> 0 - 255
            * b(2)-> 0 - 255
            * a(3)-> 0 - 255
            * r(4)-> 0 - 255   index (2ª iteracion)
            * g(5)-> 0 - 255   index + 1
            * b(6)-> 0 - 255   index + 2
            * a(7)-> 0 - 255   index + 3
            * r(8)-> 0 - 255   index (3ª iteracion)
            * g(9)-> 0 - 255
            * b(10)-> 0 - 255
            * a(11)-> 0 - 255
              ...
            */
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
            let z = gray < 300 ? gray : 10000;

            vertices.push(
                x - imageData.width / 2,
                -y + imageData.height / 2,
                z
            );

            const rgbColor = hexToRgb(colorsPerFace[Math.floor(Math.random() * colorsPerFace.length)]);
            colors.push(rgbColor.r, rgbColor.g, rgbColor.b);

            count++;
        }
    }

    const verticesArray = new Float32Array(vertices);
    geometry.addAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

    const colorsArray = new Float32Array(colors);
    geometry.addAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
};

const getImageData = (image, useCache) => {
    if (useCache && imageCache) {
        return imageCache;
    }

    const w = image.videoWidth;
    const h = image.videoHeight;

    canvas.width = w;
    canvas.height = h;

    ctx.translate(w, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(image, 0, 0);
    imageCache = ctx.getImageData(0, 0, w, h);

    return imageCache;
};

/**
 * https://github.com/processing/p5.js-sound/blob/v0.14/lib/p5.sound.js#L1765
 *
 * @param data
 * @param _frequencyRange
 * @returns {number} 0.0 ~ 1.0
 */
const getFrequencyRangeValue = (data, _frequencyRange) => {
    const nyquist = 48000 / 2;
    const lowIndex = Math.round(_frequencyRange[0] / nyquist * data.length);
    const highIndex = Math.round(_frequencyRange[1] / nyquist * data.length);
    let total = 0;
    let numFrequencies = 0;

    for (let i = lowIndex; i <= highIndex; i++) {
        total += data[i];
        numFrequencies += 1;
    }
    return total / numFrequencies / 255;
};

const draw = (t) => {
    clock.getDelta();
    const time = clock.elapsedTime;

    uniforms.time.value += 0.5;

    let r, g, b;

    // audio
    if (analyser) {
        // analyser.getFrequencyData() would be an array with a size of half of fftSize.
        const data = analyser.getFrequencyData();

        const bass = getFrequencyRangeValue(data, frequencyRange.bass);
        const mid = getFrequencyRangeValue(data, frequencyRange.mid);
        const treble = getFrequencyRangeValue(data, frequencyRange.treble);

        r = bass;
        g = mid;
        b = treble;
        //console.log('bass: '+r+' // mid: '+g+' // treble: '+b);
    }

    // video
    if (particles) {
        const useCache = parseInt(t) % 2 === 0;  // To reduce CPU usage.
        const imageData = getImageData(video, useCache);
        let count = 0;

        for (let i = 0, length = particles.geometry.attributes.position.array.length; i < length; i += 3) {
            let index = particleIndexArray[count];
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
            let threshold = 300;
            /**
            * position.array = [x,y,z,x,y,z,x,y,z,x,y,z]
            * position0 = x(0), y(1), z(2)
            * position1 = x(3), y(4), z(5)
            * position2 = x(6), y(7), z(8)
              ...
            * i = 0, 3, 6... (en cada iteracion va teniendo esos valores)
            * que corresponde con el valor x de cada punto que vamos a dibujar
			* Si nos fijamos, solo tocamos el valor z de cada punto -> position.array[i + 2]
			* i+2 porque i=x, i+1=y, i+2=z, i+3=x(del siguiente punto) ...
            */
            
            if (gray < threshold) {
                if (gray < threshold / 3) {
                    particles.geometry.attributes.position.array[i + 2] = gray * r * 5;

                } else if (gray < threshold / 2) {
                    particles.geometry.attributes.position.array[i + 2] = gray * g * 5;

                } else {
                    particles.geometry.attributes.position.array[i + 2] = gray * b * 5;
                }
            } else {
                particles.geometry.attributes.position.array[i + 2] = 10000;
            }

            count++;
        }

        uniforms.size.value = (r + g + b) / 3 * 35 + 5;

        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(draw);
};



const vertexShader = `

attribute vec3 color;

uniform float time;
uniform float size;

varying vec4 vMvPosition;
varying vec3 vColor;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vMvPosition = mvPosition;
    vColor = color;

    //gl_PointSize = size + ((sin(time * 0.05) + 1.0) / 2.0) * 10.0;
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
}

`;

const fragmentShader = `

uniform float time;

varying vec4 vMvPosition;
varying vec3 vColor;

void main() {
    vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;

    float orb = 0.1 / length(uv * 1.0);
    orb = smoothstep(0.0, 1.0, orb);

    vec3 color = vec3(orb) * vColor;

    gl_FragColor = vec4(color, 1.0);
}

`;


const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

window.addEventListener("resize", onResize);

init();
