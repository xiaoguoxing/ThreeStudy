import { WebGLRenderer, PCFSoftShadowMap } from 'three';
import { component } from './dispatcher';
import settings from './settings';
import scene from "@/modules/WebGL/modules/scene.js";
import camera from "@/modules/WebGL/modules/camera.js";

class Renderer extends component(WebGLRenderer) {
    constructor() {
        super({antialias: !settings.ENABLE_FXAA, powerPreference: 'high-performance',});

        this.setClearColor(settings.CLEAR_COLOR);
        this.setPixelRatio(settings.DPR);

        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
    }

    renderDom(dom){
        dom.appendChild(this.domElement)
    }

    onResize({ width, height ,ratio}) {
        this.setSize(width, height);
        this.setPixelRatio(ratio);
    }

    onRaf() {
        this.render(scene, camera);
    }
}

export default new Renderer();
