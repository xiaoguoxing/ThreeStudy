import {Raycaster} from "three";
import camera from "@/modules/WebGLV2/modules/camera.js";
import pointer from "@/modules/WebGLV2/modules/pointer.js";
class rayCast {
    constructor() {
        this.raycast = new Raycaster()
        this.target = []
    }
    setRayCast(objects,onHit,recursive=true){
        this.raycast.setFromCamera(pointer.norm,camera);
        this.target.length = 0
        this.raycast.intersectObjects(objects, recursive, this.target);
        if (this.target.length) onHit(this.target[0]);
        else onHit(null);
    }
}
export default new rayCast()
