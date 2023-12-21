import { Scene, Fog, FogExp2, Color } from 'three';
import { component } from './dispatcher';
import camera from './camera';
import gui from './gui';
import settings from './settings';
import gsap from 'gsap';

class MainScene extends component(Scene) {
    init() {
        this.add(camera);

        this.fog = new Fog(0xcae0e0, 30, 35);
        this.bg = new Color('#cbe0e0');
        this.background = this.bg;

        const folder = gui.folder({ title: 'Scene' });
        folder.addBinding(this.fog, 'near', { min: 0, max: 100 });
        folder.addBinding(this.fog, 'far', { min: 0, max: 100 });
    }

    setTheme(theme) {
        const { THEMES } = settings;
        const col = THEMES[theme];

        // animate clear color
        gsap.to(this.bg, { duration: 1.5, r: col.r, g: col.g, b: col.b });

        // set body theme
        for (let prop in THEMES) {
            const body = document.body;
            if (THEMES[prop] === col) body.classList.add(prop);
            else body.classList.remove(prop);
        }
    }

    setFog(fog) {
        const near = fog ? fog.near : 100;
        const far = fog ? fog.far : 100;
        gsap.to(this.fog, { near, far, duration: 1 });
    }
}

export default new MainScene();
