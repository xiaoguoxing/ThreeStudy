import {Scene, Camera, Color, Fog} from 'three'
import gsap from "gsap";
import camera from "@/modules/WebGLV2/modules/camera.js";
class scene extends Scene{
    constructor() {
        super();
        this.add(camera)
        this.fog = new Fog(0xcae0e0, 30, 35);
        this.background = new Color('#cbe0e0');
    }
    setFog(fog) {
        const near = fog ? fog.near : 100;
        const far = fog ? fog.far : 100;
        gsap.to(this.fog, { near, far, duration: 1 });
    }
}
export default new scene()
