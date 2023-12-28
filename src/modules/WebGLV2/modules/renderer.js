import {WebGLRenderer, PCFSoftShadowMap} from 'three'
import settings from "@/modules/WebGLV2/settings.js";
import scene from "@/modules/WebGLV2/modules/scene.js";
import camera from "@/modules/WebGLV2/modules/camera.js";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";
import './raf.js'
import './viewport.js'
export default class Renderer extends component(WebGLRenderer){
    constructor(dom) {
        super({canvas:dom,antialias: !settings.ENABLE_FXAA,powerPreference: 'high-performance'})
        this.setClearColor(settings.CLEAR_COLOR);
        this.setPixelRatio(settings.DPR);
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
    }
    onResize({ width, height ,ratio}) {
        this.setSize(width, height);
        this.setPixelRatio(ratio);
    }
    onRaf() {
        this.render(scene, camera);
    }
}
