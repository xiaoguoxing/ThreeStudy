import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { component } from './dispatcher';
import settings from './settings';
import gui from './gui';

const { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } = settings;

class Camera extends component(PerspectiveCamera) {
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
        const folder = gui.folder({ title: 'Camera' });
        gui.add(this, 'fov', { min: 0, max: 150 }, folder).on('change', () => {
            this.updateProjectionMatrix();
        });
    }

    initOrbitControls() {
        const controls = new OrbitControls(
            this,
            document.querySelector('.content')
        );

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = CAMERA_NEAR;
        controls.maxDistance = CAMERA_FAR;
        controls.autoRotate = false;
        // controls.maxPolarAngle = Math.PI / 2;
        controls.enableZoom = false;
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

    resetZoom(z) {
        this.zoomTo(new Vector3(0, 0, 0), z);
    }

    zoomTo(pos, z) {
        gsap.to(this.position, {
            z,
            ease: 'power2.inOut',
            duration: 1.75,
            delay: 0.25,
        });
        gsap.to(this.lookAtPos, {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.lookAt(this.lookAtPos);
            },
        });
    }

    onResize({ ratio }) {
        this.aspect = ratio;
        this.unit = this.calculateUnitSize();
        this.pxToUnits = this.unit.height / window.innerHeight;
        this.updateProjectionMatrix();
    }
}

export default new Camera();
