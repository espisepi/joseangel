import * as THREE from '../../../node_modules/three/build/three.module.js';


export class LoadGeneric {
    constructor() {}

    /* @params
     lista = {  
                    item0: { url: 'url of the item' },
                    item1: { url: 'url of the item' },
                }
    */
    static load( lista, loader) {
        return new Promise((resolve, reject) => {
            let promises = [];
            for (const item of Object.values(lista)) {
                promises.push(this.loadItem(item, loader));
            }
            Promise.all(promises)
            .then(result => {
                resolve(result);
            });
        });
    }

    static loadItem(item, loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                item.url,
                ( object ) => {
                    item.loader = object;
                    //console.log(item);
                    resolve(item);
                },
                ( xhr ) => { },
                ( err ) => { reject(new Error('could not load item ' + item.url + ', error: ' + err )) }
            );
        });
    }
}