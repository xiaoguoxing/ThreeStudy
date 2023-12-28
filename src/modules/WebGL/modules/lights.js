import { DirectionalLight, AmbientLight } from 'three';
import { component } from './dispatcher';
import scene from './scene';
import gui from './gui';

class Lights extends component() {
    init() {
        //blue
        this.light = new DirectionalLight(0x4af2d4, 1.3);
        this.light.position.set(-50, -10, -10);
        scene.add(this.light);

        //this.light.castShadow = true;
        //this.light.shadow.camera.near = 0;
        //this.light.shadow.camera.far = 100;
        //this.light.shadow.bias = 0.001;

        //this.light.shadow.mapSize.width = 2048;
        //this.light.shadow.mapSize.height = 2048;

        //yellow
        this.light2 = new DirectionalLight(0xff7e00, 1.2);
        this.light2.position.set(50, -10, -20);
        scene.add(this.light2);

        this.light3 = new DirectionalLight(0xffffff, 1.2);
        this.light3.position.set(50, 50, 20);
        scene.add(this.light3);

        // this.light2.castShadow = true;
        // this.light2.shadow.camera.near = 0;
        // this.light2.shadow.camera.far = 100;
        // this.light2.shadow.bias = 0.001;

        // this.light2.shadow.mapSize.width = 2048;
        // this.light2.shadow.mapSize.height = 2048;

        this.ambient = new AmbientLight(0xffffff, 1.2);
        scene.add(this.ambient);

        const folder = gui.folder({ title: 'Lights' });
        gui.add(this.light.position, 'x', { min: -50, max: 50 }, folder);
        gui.add(this.light.position, 'y', { min: -50, max: 50 }, folder);
        gui.add(this.light.position, 'z', { min: -50, max: 50 }, folder);
        gui.add(
            this.light,
            'intensity',
            { min: 0, max: 2, label: 'Dir. intensity' },
            folder
        );
        gui.add(
            this.ambient,
            'intensity',
            { min: 0, max: 2, label: 'Amb. intensity' },
            folder
        );
    }
}

export default new Lights();
