import {PerspectiveCamera, Vector3} from 'three'
import settings from "@/modules/WebGLV2/settings.js";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";
const { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } = settings;
class camera extends component(PerspectiveCamera) {
    constructor() {
        super(CAMERA_FOV, 0, CAMERA_NEAR, CAMERA_FAR);
    }

    init() {
        this.position.set(0, 0, 20);
        this.lookAtPos = new Vector3(0, 0, 0);
        this.lookAt(this.lookAtPos);

        if (settings.ENABLE_CONTROLS) {
            this.initOrbitControls();
        }
    }

    calculateUnitSize(distance = this.position.z) {
        const vFov = (this.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * this.aspect;

        return {
            width,
            height,
        };
    }

    onResize({ ratio }) {
        this.aspect = ratio;
        this.updateProjectionMatrix();
    }
}

export default new camera()
