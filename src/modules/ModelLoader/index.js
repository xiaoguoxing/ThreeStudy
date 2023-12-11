import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import BaseModel from '../BaseModelLoader'
export default class ModelLoader{
    viewer = null
    gltfLoader = null
    dracoLoader = null
    // constructor(viewer,decoderPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/') {
    constructor(viewer,decoderPath = '/draco/') {
        this.viewer = viewer
        this.gltfLoader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()

        this.dracoLoader.setDecoderPath(decoderPath)
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
    }
    loadModelToScene(url='', callback=()=>{}) {
        this.#loadModel(url, model => {
            this.viewer.scene.add(model.object);
            callback && callback(model);
        });
    }
    #loadModel(url='',callback=()=>{}){
        this.gltfLoader.load(url,(gltf)=>{
            const baseModel = new BaseModel(gltf, this.viewer);
            callback && callback(baseModel);
        },function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        })
    }
}
