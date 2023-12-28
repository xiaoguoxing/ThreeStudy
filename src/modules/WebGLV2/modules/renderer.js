import {Scene, Camera, WebGLRenderer, PCFSoftShadowMap} from 'three'
import settings from "@/modules/WebGLV2/settings.js";
import scene from "@/modules/WebGL/modules/scene.js";
import camera from "@/modules/WebGL/modules/camera.js";

export default class Renderer extends WebGLRenderer{
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
