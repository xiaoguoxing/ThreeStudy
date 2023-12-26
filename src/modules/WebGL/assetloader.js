import {TextureLoader, ImageLoader, CubeTextureLoader, ObjectLoader} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
const noop = () => {};

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

const textureLoader = new TextureLoader();
const imageLoader = new ImageLoader();
const cubeTextureLoader = new CubeTextureLoader();
const objectLoader = new ObjectLoader();
const Objloader = new OBJLoader();
class AssetLoader {
    constructor() {
        this.loadQueue = [];
        this.cache = {};
        this.onComplete = noop;
        this.onProgress = noop;
        this.renderer = null;
        this.numItems = 0;
    }

    queue(item) {
        this.loadQueue.push(item);
        this.numItems++;
    }

    load() {
        // check if loading is completed
        if (this.loadQueue.length <= 0) {
            this.onProgress(1);
            this.onComplete();
            return;
        }

        // get first item in line
        const item = this.loadQueue.shift();

        // check type
        switch (item.type) {
            case 'gltf':
                this.loadGLTF(item, this.loadComplete);
                break;
            case 'json':
                this.loadJSON(item, this.loadComplete);
                break;
            case 'obj':
                this.loadOBJ(item, this.loadComplete);
                break;
            case 'texture':
                this.loadTexture(item, this.loadComplete);
                break;
            case 'image':
                this.loadImage(item, this.loadComplete);
                break;
            case 'cubetexture':
                this.loadCubeTexture(item, this.loadComplete);
                break;
            default:
                console.warn(`Incorrect asset type for ${item.url}`);
                this.load();
                break;
        }
        // set progress
        const numLoaded = this.numItems - this.loadQueue.length -1;
        this.onProgress(numLoaded / this.numItems);
    }

    loadComplete = (err, item, data) => {
        if (err) {
            console.warn(`An error occured loading ${item.url}`);
        } else {
            const id = item.id || item.url;
            this.cache[id] = data;
            this.load();
        }
    };

    loadGLTF(item, done) {
        gltfLoader.load(
            item.url,
            (data) => {
                done(null, item, data);
            },
            () => {},
            (err) => {
                done(err,item);
            }
        );
    }

    loadJSON(item, done) {
        objectLoader.load(
            item.url,
            (data) => {
                done(null, item, data);
            },
            () => {},
            (err) => {
                done(err,item);
            }
        );
    }
    loadOBJ(item, done) {
        Objloader.load(
            item.url,
            (data) => {
                done(null, item, data);
            },
            () => {},
            (err) => {
                done(err,item);
            }
        );
    }

    loadTexture(item, done) {
        textureLoader.load(
            item.url,
            (texture) => {
                const { settings } = item;
                if (settings) {
                    for (let prop in settings) {
                        texture[prop] = settings[prop];
                    }
                }
                if (this.renderer) {
                    this.renderer.initTexture(texture);
                }
                done(null, item, texture);
            },
            null,
            (err) => {
                done(err);
            }
        );
    }

    loadCubeTexture(item, done) {
        const envMap = cubeTextureLoader.load(
            item.urls,
            (cubeTexture) => {
                done(null, item, cubeTexture);
            },
            null,
            (err) => {
                done(err);
            }
        );
    }

    loadImage(item, done) {
        imageLoader.load(
            item.url,
            (image) => {
                done(null, item, image);
            },
            null,
            (err) => {
                done(err);
            }
        );
    }

    get(key) {
        const item = this.cache[key];
        if (!item) {
            console.warn(`Could not get asset ${key}`);
            return;
        }
        return item;
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    completed(fn) {
        if (typeof fn !== 'function')
            throw 'The completed parameter must be a function';

        this.onComplete = fn;
    }

    progress(fn) {
        if (typeof fn !== 'function')
            throw 'The progress parameter must be a function';

        this.onProgress = fn;
    }
}

export default new AssetLoader();
