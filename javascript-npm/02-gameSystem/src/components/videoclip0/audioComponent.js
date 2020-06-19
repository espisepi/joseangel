import { Component } from "../component.js";
import * as THREE from '../../../../node_modules/three/build/three.module.js';

export class AudioComponent extends Component {

    constructor(gameObject, params) {
        super(gameObject);
        
        this.mesh = params.mesh;
        if(params.audio){
            this.addAudio(params.audio);
        };

        gameObject.transform.add(this.mesh);
    }

    setTexture(texture) {
        this.mesh.material.map = texture;
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
        this.initialPosition = this.mesh.geometry.attributes.position.array.slice();
    }

    update(globals){
        if(this.analyser) {
            this.updateAnalyser();
        }

    }
    getImageData(useCache) {
        const image = this.mesh.material.map.image;
        if(!(useCache && this.imageData)){
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
    getFrequencyRangeValue (data, _frequencyRange) {
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
    updateAnalyser() {
        const mesh = this.mesh;
        const data = this.analyser.getFrequencyData();
        this.getImageData(true);
        
		const bass = this.getFrequencyRangeValue(data, this.frequencyRange.bass);
       	const mid = this.getFrequencyRangeValue(data, this.frequencyRange.mid);
        const treble = this.getFrequencyRangeValue(data, this.frequencyRange.treble);
        
        const arrayPosition = mesh.geometry.attributes.position.array;
        
        for(let i = 0; i < arrayPosition.length; i = i + 3 ){
            const gray = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
            const threshold = 240;
            if (gray < threshold) {
                arrayPosition[i + 2] = ( gray / 256.0) * bass * 0.5;
            } else {
                arrayPosition[i + 2] = ( gray / 256.0) * treble * 0.5;
            }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();

    }
}