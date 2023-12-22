
import { Vector2 } from 'three';
import gsap from 'gsap';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShift } from './shaders/rgbshift';
import { FinalShader } from './shaders/finalshader';

import settings from './settings';
import renderer from './renderer';
import camera from './camera';
import scene from './scene';
import lights from './lights';
import { component } from './dispatcher';
import pointer from './pointer';
// import controller from '../controller';
// import assets from '../assetloader';

import './raf';
import './viewport';
import './gui';

export default class App extends component() {
    init() {
        this.composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        this.shiftPass = new ShaderPass(RGBShift);
        this.composer.addPass(this.shiftPass);

        this.finalPass = new ShaderPass(FinalShader);
        this.composer.addPass(this.finalPass);
    }

    onResize({ width, height }) {
        const resolution = new Vector2();
        renderer.getDrawingBufferSize(this.finalPass.uniforms.uResolution.value);
        this.composer.setSize(width, height);
    }

    onShiftToggle({ enabled, waveFactor, speed, shiftAmount }) {
        if (enabled) {
            this.shiftPass.uniforms.enabled.value = enabled;
        }

        gsap.to(this.shiftPass.uniforms.waveFactor, {
            value: waveFactor,
            duration: 1,
        });
        gsap.to(this.shiftPass.uniforms.shiftAmount, {
            value: shiftAmount,
            duration: 1,
        });
        gsap.to(this.shiftPass.uniforms.speed, {
            value: speed,
            duration: 1,
            onComplete: () => {
                if (!enabled) this.shiftPass.uniforms.enabled.value = enabled;
            },
        });
    }

    onRaf({ elapsed }) {
        pointer.update();
        // controller.update();
        this.shiftPass.uniforms.uTime.value = elapsed;
        this.composer.render();
    }
}
