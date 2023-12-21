import { Raycaster } from 'three';
import pointer from './pointer';
import camera from './camera';

class Raycast {
    constructor() {
        this.raycaster = new Raycaster();
        this.target = [];
    }

    intersect(objects, onHit, recursive = true) {
        this.raycaster.setFromCamera(pointer.norm, camera);
        this.target.length = 0;

        this.raycaster.intersectObjects(objects, recursive, this.target);

        if (this.target.length) onHit(this.target[0]);
        else onHit(null);
    }
}

export default new Raycast();
