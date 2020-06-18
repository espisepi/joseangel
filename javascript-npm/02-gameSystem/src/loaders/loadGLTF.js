import {GLTFLoader} from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

export class LoadGLTF {
    constructor(){ }

    /* @params
        models = {  
                    model0: { url: 'url del modelo' },
                    model1: { url: 'url del modelo' },
                }
    */
    static load(models) {
        return new Promise((resolve, reject) => {
            let promises = [];
            const gltfLoader = new GLTFLoader();
            for (const model of Object.values(models)) {
                promises.push(this.loadModel(model, gltfLoader));
            }
            Promise.all(promises)
            .then(result => {
                resolve(result);
            });
        });
    }

    static loadModel(model, gltfLoader) {
        return new Promise((resolve, reject) => {
            gltfLoader.load(
                model.url,
                ( gltf ) => {
                    model.gltf = gltf;
                    //console.log(model);
                    resolve(model);
                },
                ( xhr ) => { },
                ( err ) => { reject(new Error(`could not load model, error: ` + err )) }
            );
        });
    }
}