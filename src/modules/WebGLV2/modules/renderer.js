import {WebGLRenderer, PCFSoftShadowMap} from 'three'
import scene from "@/modules/WebGLV2/modules/scene.js";
import camera from "@/modules/WebGLV2/modules/camera.js";
import linghts from "@/modules/WebGLV2/modules/linghts.js";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";
import settings from "@/modules/WebGLV2/settings.js";
import pointer from '@/modules/WebGLV2/modules/pointer'
import './raf.js'
import './viewport.js'
export default class Renderer extends component(WebGLRenderer){
    constructor(dom) {
        super({canvas:dom,antialias: !settings.ENABLE_FXAA,powerPreference: 'high-performance'})
        this.setClearColor(settings.CLEAR_COLOR);
        this.setPixelRatio(settings.DPR);
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        scene.add(...linghts())
        if (settings.ENABLE_CONTROLS) {
            camera.initOrbitControls(this.domElement);
        }
    }
    setViewModel(object3D){
        scene.add(object3D)
    }
    onResize({ width, height ,ratio}) {
        this.setSize(width, height);
        this.setPixelRatio(ratio);
    }
    onRaf() {
        pointer.update();
        this.render(scene, camera);
    }
}
