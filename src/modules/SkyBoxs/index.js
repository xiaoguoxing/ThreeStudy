import * as THREE from 'three'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {SRGBColorSpace} from "three";

const Sky = {
    daytime: 'daytime',
    dusk: 'dusk',
    night: 'night',
}
export default class SkyBoxs {
    viewer = null
    cubeTexture = null

    constructor(viewer) {
        this.viewer = viewer
    }

    addFog(color = 0xa0a0a0, near = 500, far = 2000) {
        this.viewer.scene.fog = new THREE.Fog(new THREE.Color(color), near, far);
    }

    removeFog() {
        this.viewer.scene.fog = null;
    }

    addSkybox(skyType) {
        const path = `/skybox/${Sky[skyType]}/`; // 设置路径
        const format = '.jpg'; // 设定格式
        this.#setSkybox(path, format);
    }

    #setSkybox(path, format = '.jpg') {
        const loaderbox = new THREE.CubeTextureLoader();
        this.cubeTexture = loaderbox.load([
            path + 'posx' + format,
            path + 'negx' + format,
            path + 'posy' + format,
            path + 'negy' + format,
            path + 'posz' + format,
            path + 'negz' + format,
        ]);
        // const loaderbox = new RGBELoader();
        // this.cubeTexture = loaderbox.loadAsync('/xingkong.hdr').then(res =>{
        //     res.mapping = THREE.EquirectangularReflectionMapping;
        //     this.viewer.scene.background =   (res);
        // });

        /*const a = new THREE.TextureLoader()
        let b = a.load('/skybox/xingkong.jpg')
        b.mapping = THREE.EquirectangularRefractionMapping;
        // console.log(b);
        // b.minFilter = THREE.NearestMipmapNearestFilter
        b.wrapS = THREE.ClampToEdgeWrapping;
        b.wrapT = THREE.ClampToEdgeWrapping;
        // 需要把色彩空间编码改一下
        this.viewer.scene.background = b;*/


        this.viewer.scene.background =  this.cubeTexture;

        // this.viewer.scene.environment  =  this.cubeTexture;
    }
}
