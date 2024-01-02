import {MeshLambertMaterial, MeshPhongMaterial, Color, Group} from 'three';
import gsap from 'gsap';
import BaseInstance from './baseinstance.js';
import assets from '@/modules/WebGLV2/assetloader';
import { randBetween } from '@/utils';
import camera from '@/modules/WebGLV2/modules/camera';
const MODELS = [
    {
        url: `bong.glb`,
        scale: 0.5,
    },
    {
        url: `cbd.glb`,
        scale: 0.7,
    },
    {
        url: `thc.glb`,
        scale: 0.7,
    },
    {
        url: `molecule.glb`,
        scale: 0.7,
    },
    {
        url: `flask.glb`,
        scale: 0.5,
    },
    {
        url: `leaf.glb`,
        scale: 0.3,
    },
];

export default class Frontpage extends BaseInstance {
    constructor(opts) {
        super(opts);
    }

    init() {
        // this.envMap = assets.get('envmap');

        const matUserData = {
            myRandomFloat: { value: 0.05 },
        };
        const matLeft = new MeshLambertMaterial({
            color: new Color(0xf7f7f7),
            map: assets.get((`brain-left-texture2.jpg`)),
        });

        matLeft.userData = matUserData;


        const matRight = new MeshPhongMaterial({
            //envMap: this.envMap,
            //reflectivity: 0,
            color: new Color(0xf7f7f7),
            map: assets.get((`brain-left-texture2.jpg`)),
        });

        matRight.userData = matUserData;


        this.brainContainer = assets.get((`brain.glb`)).scene.children[0];
        const left = this.brainContainer.getObjectByName('brain_left001');
        const right = this.brainContainer.getObjectByName('brain_right001');

        left.material = matLeft;
        right.material = matRight;

        left.position.x = 0.0001;
        this.brainContainer.scale.set(
            Math.min(window.innerHeight * 0.3, 270),
            Math.min(window.innerHeight * 0.3, 270),
            Math.min(window.innerHeight * 0.3, 270)
        );
        this.brainContainer.position.y = 1;

        this.objContainer = new Group();

        this.add(this.brainContainer);


        this.introAnim = gsap.timeline({ paused: false });
        this.introAnim.fromTo(
            left.position,
            {
                x: -0.05,
                y: -0.05,
            },
            {
                x: 0.0001,
                y: 0,
                duration: 4,
                ease: 'easeInOut',
            },
            0
        );

        this.introAnim.fromTo(
            left.rotation,
            {
                z: 1,
                x: 0,
            },
            {
                z: 0,
                x: Math.PI * 1,
                duration: 4,
                ease: 'easeInOut',
            },
            0
        );

        this.introAnim.fromTo(
            right.rotation,
            {
                z: 1,
                x: 0,
            },
            {
                z: 0,
                x: -Math.PI * 0.5,
                duration: 3,
                ease: 'easeInOut',
            },
            0
        );

        this.introAnim.fromTo(
            right.position,
            {
                x: 0.0025,
                y: -0.05,
            },
            { x: 0, y: 0, duration: 3, ease: 'easeInOut' },
            0
        );

        this.outAnim = gsap.timeline({ paused: true });



        this.outAnim.fromTo(this.objContainer.position, { y: 0 }, { y: 10 }, 0);
        this.outAnim
            .fromTo(
                this.brainContainer.rotation,
                {
                    x: this.brainContainer.rotation.x,
                },
                { x: -0.5 },
                0
            )
            .to(this.brainContainer.rotation, { x: -0.6, ease: 'easeInOut' }, 0.5);

        // const folder = gui.folder({ title: 'Brain' });
        // gui.guiColor('color', mat, folder);

        this.createObjects();
        this.playIntroAnim();
    }

    playIntroAnim() {
        this.introAnim.progress(0);
        this.introAnim.play();
    }

    getRandomPosition(pos, leftSide, randZ = false) {
        let x;
        let y = randBetween(-8, 8);

        if (leftSide) {
            x = randBetween(
                -window.innerWidth * 0.006,
                -Math.max(window.innerWidth * 0.003, 4)
            );
        } else {
            x = randBetween(
                window.innerWidth * 0.006,
                Math.max(window.innerWidth * 0.002, 4)
            );
        }

        pos.set(x, y, randZ ? randBetween(-10, camera.position.z) : pos.z);
    }

    createObjects() {
        this.objects = [];

        this.add(this.objContainer);
        const mat = new MeshPhongMaterial({
            color: 0xf7f7f7,
            //envMap: this.envMap,
            //reflectivity: 0.05,
        });

        for (let model of MODELS) {
            const { url, scale } = model;
            const container = assets.get((url)).scene;
            const mesh = assets.get((url)).scene.children[0];
            const obj = {
                container,
                vz: randBetween(-0.05, -0.05),
                rx: randBetween(0, 0.01),
                ry: randBetween(0, 0.01),
                rz: randBetween(0, 0.01),
            };
            mesh.scale.set(scale, scale, scale);
            mesh.material = mat;
            this.getRandomPosition(container.position, true, true);
            this.objContainer.add(container);
            this.objects.push(obj);

            const clone = mesh.clone();
            const cont2 = new Group();
            cont2.add(clone);
            const obj2 = {
                container: cont2,
                vz: randBetween(-0.05, -0.05),
                rx: randBetween(0, 0.01),
                ry: randBetween(0, 0.01),
                rz: randBetween(0, 0.01),
            };
            this.getRandomPosition(cont2.position, false, true);
            this.objects.push(obj2);
            this.objContainer.add(cont2);
        }
    }

    onRaf() {
        // if (!this.active) return;
        // this.brainContainer.rotation.x = -pointer.normEased.y * 0.3;
        // this.brainContainer.rotation.y = -pointer.normEased.x * 0.3;
        //
        // this.objContainer.rotation.y = -pointer.normEased.x * 0.35;
        // this.objContainer.position.x = -pointer.normEased.x * 3;

        for (let obj of this.objects) {
            const container = obj.container;
            container.position.z += obj.vz;

            container.rotation.x += obj.rx;
            container.rotation.y += obj.ry;
            container.rotation.z += obj.rz;

            if (container.position.z < -16) container.position.z = camera.position.z;
        }
    }
}
