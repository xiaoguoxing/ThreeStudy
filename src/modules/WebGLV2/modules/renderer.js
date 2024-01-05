import {WebGLRenderer, PCFSoftShadowMap} from 'three'
import scene from "@/modules/WebGLV2/modules/scene.js";
import camera from "@/modules/WebGLV2/modules/camera.js";
import linghts from "@/modules/WebGLV2/modules/linghts.js";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";
import settings from "@/modules/WebGLV2/settings.js";
import pointer from '@/modules/WebGLV2/modules/pointer'
import gui from "@/modules/WebGLV2/modules/gui.js";
import {raf} from '@/modules/WebGLV2/modules/raf.js'
import {viewport} from '@/modules/WebGLV2/modules/viewport.js'
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
    destroyAll() {
        raf.pause()//动画
        pointer.disable()//鼠标事件
        viewport.dispose();//窗口变化
        gui.dispose()//调试工具
        scene.traverse((child) => {
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
            child = null;
        });
        this.forceContextLoss();
        scene.clear();//场景
        this.dispose();//render
        this.destroy();//component销毁
        camera.destroy();//component销毁
    }
}
