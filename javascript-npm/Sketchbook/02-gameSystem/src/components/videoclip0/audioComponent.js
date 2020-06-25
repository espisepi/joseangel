import { Component } from "../component.js";
import * as THREE from '../../../../node_modules/three/build/three.module.js';

export class AudioComponent extends Component {

    constructor(gameObject, params) {
        super(gameObject);

        this.animation = params.animation;
        this.mesh = params.mesh;
        if(params.audio){
            this.addAudio(params.audio);
        };
        this.hasTexture = false;
        if(params.texture) {
            this.hasTexture = true;
            this.mesh.material.map = params.texture;
        }

        gameObject.transform.add(this.mesh);
    }

    addAudio(audio) {
        
        const audioListener = new THREE.AudioListener();
        this.audio = new THREE.Audio(audioListener);
        this.audio.setBuffer(audio.loader);
        this.audio.setLoop(true);
        this.audio.setVolume(0.5);
        this.audio.play();
        /* Empieza el analizador */
        const fftSize = 2048;  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
        this.frequencyRange = {
            bass: [20, 140],
            lowMid: [140, 400],
            mid: [400, 2600],
            highMid: [2600, 5200],
            treble: [5200, 14000],
        };
        this.analyser = new THREE.AudioAnalyser(this.audio, fftSize);
    }

    update(globals){
        if(this.analyser) {
            this.updateAnalyser();
        }

    }
    
    updateAnalyser() {

        const params = {
            mesh: this.mesh,
            bass: this.getFrequencyRangeValue(this.frequencyRange.bass),
            mid: this.getFrequencyRangeValue(this.frequencyRange.mid),
            treble: this.getFrequencyRangeValue(this.frequencyRange.treble),
        };
        
        if(this.hasTexture) {
            this.getImageData();
            if(this.animation === 'altavoces'){
                this.sphereTextureAnimation(params);
            }else {
                this.textureAnimation(params);
            }
        }else{
            this.simpleAnimation(params);
        }
        
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeFaceNormals();

    }

    textureAnimation(params) {
        const arrayPosition = params.mesh.geometry.attributes.position.array;
        const bass = params.bass;
        const mid = params.mid;
        const treble = params.treble;
        for(let i = 0; i < arrayPosition.length; i = i + 3 ){
            const gray = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
            const threshold = 240;
            if (gray < threshold) {
                arrayPosition[i + 2] = ( gray / 256.0) * bass * 0.5;
            } else {
                arrayPosition[i + 2] = ( gray / 256.0) * treble * 0.5;
            }
        }
    }

    sphereTextureAnimation(params) {
        const arrayPosition = params.mesh.geometry.attributes.position.array;
        const bass = params.bass;
        const mid = params.mid;
        const treble = params.treble;
        const paramsForDance = {
            bass: params.bass,
            mid: params.mid,
            treble: params.treble,
            arrayPosition: arrayPosition
        };
        for(let i = 0; i < arrayPosition.length; i = i + 3 ){
            const gray = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
            const threshold = 240;
            if (gray < threshold) {
                arrayPosition[i] = ( gray / 256.0) * bass * 0.5;
            } else {
            }
            
        }
    }
    altavoces(params, i) {
        // Bug: No se actualiza arrayPosition
        //paramsForDance.gray = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
        //paramsForDance.threshold = 240;
        const [bass, gray, threshold, arrayPosition] = Object.values(params);
        if (gray < threshold) {
            arrayPosition[i] = ( gray / 256.0) * bass * 0.5;
        } else {
        }
    }
    cilindro(){
        if (gray < threshold) {
            arrayPosition[i] = ( gray / 256.0) * bass * 0.5;
            arrayPosition[i + 2] = ( gray / 256.0) * bass * 0.5;
            arrayPosition[i + 1] = ( gray / 256.0) * bass * 0.5;
        } else {
        }
    }

    simpleAnimation(params) {
        const arrayPosition = params.mesh.geometry.attributes.position.array;
        const bass = params.bass;
        const mid = params.mid;
        const treble = params.treble;
        for(let i = 0; i < arrayPosition.length; i = i + 3 ){
            if( arrayPosition[i] < 0.0 ) {
                arrayPosition[i + 2] = bass * 0.5;
            } else {
                arrayPosition[i + 2] = treble * 0.5;
            }
        }
    }


    /* ********* Utils methods ********* */

    getImageData() {
        if(!this.imageData){
            const image = this.mesh.material.map.image;
            const canvas = document.createElement("CANVAS");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(image, 0, 0);
            //document.body.append(canvas);
            this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        
    }
    getFrequencyRangeValue (_frequencyRange) {
        const data = this.analyser.getFrequencyData();
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
}