import * as THREE from 'three'
import {SRGBColorSpace} from "three";
const  Sky = {
    daytime : 'daytime',
    dusk : 'dusk',
    night : 'night',
}
export default class SkyBoxs {
    viewer = null

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
    #setSkybox (path, format = '.jpg') {
        const loaderbox = new THREE.CubeTextureLoader();
        const cubeTexture = loaderbox.load([
            path + 'posx' + format,
            path + 'negx' + format,
            path + 'posy' + format,
            path + 'negy' + format,
            path + 'posz' + format,
            path + 'negz' + format,
        ]);
        // 需要把色彩空间编码改一下
        this.viewer.scene.background = cubeTexture;
    }
}
