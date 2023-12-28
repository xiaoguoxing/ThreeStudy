import { Group} from 'three';
import dispatcher from './modules/dispatcher';
import scene from './modules/scene';
import camera from './modules/camera';
const EPSILON = 0.000001;

let M = 850 / window.innerHeight;

if (window.innerWidth > 768) {
    M = 1;
}

M = Math.max(M, 1);
M = Math.min(M, 1.4);

class Controller {
    constructor() {
        this.container = new Group();
        this.container.name = 'container'
        scene.add(this.container);
        this.instances = [];
        dispatcher.on('resize', this.onResize);
    }

    onResize = () => {

    };

    register(sections) {
        this.instances = sections.map((instance) => {
            const { Constructor } = instance;
            return new Constructor(instance);
        });
        this.instances.forEach((instance, index) => {
            const pos = -camera.unit.height * index * M;
            const origin = index * window.innerHeight;
            instance.setOrigin(origin, pos);
            this.container.add(instance);
        });
    }

}

export default new  Controller();
