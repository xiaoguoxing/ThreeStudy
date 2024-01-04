import {PerspectiveCamera, Vector3} from 'three'
import settings from "@/modules/WebGLV2/settings.js";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gui from '@/modules/WebGLV2/modules/gui.js'
const { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } = settings;
class camera extends component(PerspectiveCamera) {
    constructor() {
        super(CAMERA_FOV, 0, CAMERA_NEAR, CAMERA_FAR);
        const a = gui.folder({title:'相机'})
        gui.add(this,'fov',{min:0,max:150,label:'fov'},a).on('change', () => {
            this.updateProjectionMatrix();
        });
    }

    init() {
        this.position.set(0, 0, 20);
        this.lookAtPos = new Vector3(0, 0, 0);
        this.lookAt(this.lookAtPos);
    }

    initOrbitControls(controlsDom) {
        this.controls = new OrbitControls(this,controlsDom);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = CAMERA_NEAR;
        this.controls.maxDistance = CAMERA_FAR;
        this.controls.autoRotate = false;
        // controls.maxPolarAngle = Math.PI / 2;
        this.controls.enableZoom = false;
        this.controls?.update();
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

    onRaf(){
        this.controls?.update();
    }
}

export default new camera()
