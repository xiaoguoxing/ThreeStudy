import {
    BoxGeometry,
    MeshBasicMaterial,
    Object3D,
    Mesh,
    Vector3,
} from 'three';
import camera from './camera';
import dispatcher from './dispatcher';
import gsap from 'gsap';

export default class Hotspots {
    constructor({ items, target, debug, debugScale, zoomFactor }) {
        this.items = items;
        this.target = target;
        this.pos = new Vector3();
        this.widthHalf = window.innerWidth / 2;
        this.heightHalf = window.innerHeight / 2;

        this.hotspotActiveEl = null;
        this.hotspotActive = null;

        this.debug = debug;
        this.debugMaterial = null;
        this.debugMesh = null;
        this.debugScale = debugScale || 0.3;
        this.zoomFactor = zoomFactor;

        if (debug) {
            this.debugMaterial = new MeshBasicMaterial({ color: 'red' });
            this.debugGeom = new BoxGeometry(
                this.debugScale,
                this.debugScale,
                this.debugScale
            );
        }

        for (let hotspot of items) {
            const obj = new Object3D();
            obj.position.copy(hotspot.pos);
            hotspot.obj = obj;
            target.add(obj);
            hotspot.el.addEventListener('click', () => {
                this.closeActive();
                this.onHotspotClick(hotspot);
                if (hotspot.onOpen) hotspot.onOpen();
            });

            if (debug) obj.add(new Mesh(this.debugGeom, this.debugMaterial));
        }

        dispatcher.on('resize', () => {
            this.widthHalf = window.innerWidth / 2;
            this.heightHalf = window.innerHeight / 2;
        });
    }

    closeActive() {
        if (this.hotspotActive) this.closeHotspot();
    }

    closeHotspot() {
        gsap.to(this.hotspotActiveEl, {
            duration: 0.45,
            opacity: 0,
            scale: 0.6,
            ease: 'power4.out',
            clearProps: 'all',
        });

        if (this.hotspotActive.onClose) this.hotspotActive.onClose();

        this.hotspotActive.el.classList.remove('hide');
        this.hotspotActiveEl = null;
        this.hotspotActive = null;

        camera.resetZoom(20);
    }

    onHotspotClick(target) {
        const id = target.el.getAttribute('id');
        const query = `[data-id*="${id}"]`;
        const el = document.querySelector(query);

        if (el) {
            const closeBtn = el.querySelector('.close-btn');
            const onClose = (evt) => {
                // dont close if we match one of these
                const patterns = [
                    'div.scrollable',
                    'div.hotspot-content',
                    '.scrollable h3',
                    '.scrollable p',
                ];

                if (evt.target) {
                    for (const str of patterns) {
                        if (evt.target.matches(str)) return;
                    }
                }

                // close if no matches were found
                document.removeEventListener('click', onClose);
                this.closeActive();
            };

            const world = new Vector3();
            const pos = target.obj.localToWorld(world);
            const newPos = pos.clone();

            if (window.innerWidth > 768) {
                newPos.x -= 1;
            }

            camera.zoomTo(newPos, this.zoomFactor);

            target.el.classList.add('hide');

            setTimeout(() => {
                gsap.set(el, { display: 'block' });
                gsap.from(el, {
                    duration: 0.65,
                    opacity: 0,
                    scale: 0.6,
                    rotateX: 15,
                    ease: 'power4.out',
                });

                gsap.from(el.querySelector('h3'), {
                    duration: 0.6,
                    y: 10,
                    opacity: 0,
                    ease: 'power4.out',
                    delay: 0.3,
                });

                const texts = el.querySelectorAll('p');

                for (let i = 0; i < texts.length; i++) {
                    const p = texts[i];
                    gsap.from(p, {
                        duration: 0.6,
                        y: 10,
                        opacity: 0,
                        ease: 'power4.out',
                        delay: 0.4 + i * 0.05,
                    });
                }

                document.addEventListener('click', onClose);
            }, 2000);

            this.hotspotActiveEl = el;
            this.hotspotActive = target;
        }
    }

    update() {
        for (let hotspot of this.items) {
            this.pos.setFromMatrixPosition(hotspot.obj.matrixWorld);
            this.pos.project(camera);

            this.pos.x = this.pos.x * this.widthHalf + this.widthHalf;
            this.pos.y = -(this.pos.y * this.heightHalf) + this.heightHalf;
            this.pos.z = 0;

            hotspot.el.style.transform = `translate(${this.pos.x - 15}px, ${
                this.pos.y - 15
            }px)`;
        }
    }
}
