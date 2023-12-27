import { Group} from 'three';
import dispatcher from './modules/dispatcher';
import scene from './modules/scene';
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
            this.container.add(instance);

        });
    }

}

export default new  Controller();
