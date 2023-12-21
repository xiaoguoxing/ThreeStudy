import { WebGLRenderer, PCFSoftShadowMap } from 'three';
import { component } from './dispatcher';
import settings from './settings';

class Renderer extends component(WebGLRenderer) {
    constructor() {
        super({antialias: !settings.ENABLE_FXAA, powerPreference: 'high-performance',});

        this.setClearColor(settings.CLEAR_COLOR);
        this.setPixelRatio(settings.DPR);

        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
    }

    onResize({ width, height }) {
        this.setSize(width, height);
    }
}

export default new Renderer();