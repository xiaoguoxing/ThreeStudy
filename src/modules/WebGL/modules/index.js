import renderer from './renderer';
import scene from './scene';
import { component } from './dispatcher';
import pointer from './pointer';

import './lights';
import './raf';

export default class App extends component() {
    init() {

    }

    onResize({ width, height }) {

    }

    onShiftToggle({ enabled, waveFactor, speed, shiftAmount }) {

    }

    onRaf({ elapsed }) {
        pointer.update();
        // controller.update();
        // this.shiftPass.uniforms.uTime.value = elapsed;
        // this.composer.render();
    }

    destroy() {
        scene.traverse((child) => {
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
            child = null;
        });
        renderer.forceContextLoss();
        renderer.dispose();
        scene.clear();
    }
}
