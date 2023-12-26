import { Object3D } from 'three';
import gsap from 'gsap';
import { mouseWheel, clamp, getFractionBetween } from '@/utils';
import dispatcher from './modules/dispatcher';
import camera from './modules/camera';
import scene from './modules/scene';
// import sideNav from './sidenav';
// import track from './tracking';

const EPSILON = 0.000001;

let M = 850 / window.innerHeight;

if (window.innerWidth > 768) {
    M = 1;
}

M = Math.max(M, 1);
M = Math.min(M, 1.4);

class Controller {
    constructor() {
        this.instances = [];

        this.maxScroll = 0;
        this.scrollPos = 0;
        this.smoothScroll = 0;
        this.currentActive = -1;
        this.closest = -1;
        this.dir = 1;

        this.hasStopped = false;
        this.animInstance = null;
        this.shouldUpdate = true;
        this.cheatsActivated = false;

        this.isTouch = !document.body.classList.contains('no-touch');

        this.easing = this.isTouch ? 0.05 : 0.1;

        // touch drag controls
        if (this.isTouch) {
            dispatcher.on('pointerDrag', ({ pointer, evt }) => {
                const parent = evt.target.parentNode;
                const noScroll = parent.getAttribute('data-noscroll') !== null;

                if (noScroll) return;

                evt.preventDefault();

                const { moveDelta } = pointer;
                this.addScroll(moveDelta.y);
            });
        }

        // keymap to cheatcodes
        // t: 84, h: 72, c: 67
        const keyMap = {};

        // keyboard support
        window.addEventListener('keydown', (evt) => {
            // arrow keys
            if (evt.keyCode === 40) {
                this.addScroll(30);
            } else if (evt.keyCode === 38) {
                this.addScroll(-30);
            }

            // cheat code
            keyMap[evt.keyCode] = true;

            if (keyMap[84] && keyMap[72] && keyMap[67]) {
                this.activateTHC();
            }
        });

        window.addEventListener('keyup', (evt) => {
            keyMap[evt.keyCode] = false;
        });

        // start btn
        // document.querySelector('button.start-btn').addEventListener('click', () => {
        //     this.scrollPos = window.innerHeight * 0.5;
        // });

        // resize
        dispatcher.on('resize', this.onResize);
    }

    init(dom){
        this.container = new Object3D();
        this.container.name = 'container'
        scene.add(this.container);
        // mousewheel
        mouseWheel(dom, (dx, dy) => {
            this.addScroll(dy);
        });
    }

    activateTHC() {
        if (!this.cheatsActivated) {
            const settings = {
                waveFactor: 0.018,
                shiftAmount: 0.015,
                speed: 0.8,
                enabled: true,
            };
            dispatcher.trigger({ name: 'shiftToggle' }, { ...settings });
            gsap.from('#app', { opacity: 0.2, ease: 'power2.in' });
            this.cheatsActivated = true;
        }
    }

    onResize = () => {
        // update max scroll
        this.maxScroll =
            window.innerHeight * this.instances.length - window.innerHeight;

        // update instances
        this.instances.forEach((instance, index) => {
            const pos = -camera.unit.height * index;
            const origin = index * window.innerHeight;
            instance.setOrigin(origin, pos);
            instance.update(this.smoothScroll);
        });
    };

    addScroll(val) {
        const current = Math.round(this.smoothScroll / window.innerHeight);
        const currentInstance = this.instances[current];

        // make sure you cant scroll if a hotspot is open
        if (currentInstance?.hotspots?.hotspotActive) return;

        // add to current scrollpos
        val = this.isTouch ? val : val;

        // cap large speeds
        if (val > 150) val = 150;

        if (this.hasStopped) {
            this.animInstance.updateAnimations(val, (continueScroll) => {
                if (continueScroll) {
                    this.smoothScroll += val;
                    this.hasStopped = false;
                }
            });
        } else {
            this.scrollPos += val;
        }

        // get scrolldirection
        this.dir = val > 0 ? 1 : -1;

        // clamp scroll
        this.scrollPos = clamp(this.scrollPos, 0, this.maxScroll);
        this.smoothScroll = clamp(this.smoothScroll, 0, this.maxScroll);
    }

    register(sections) {
        this.instances = sections.map((instance) => {
            const { Constructor } = instance;
            return new Constructor(instance);
        });

        this.instances.forEach((instance, index) => {
            const pos = -camera.unit.height * index * M;
            const origin = index * window.innerHeight;
            instance.setOrigin(origin, pos);
            instance.update(this.smoothScroll);
            this.container.add(instance);
        });

        this.maxScroll =
            window.innerHeight * this.instances.length - window.innerHeight;
    }

    setIndex(index, offset) {
        if (index >= 8) index += 1;

        const target = index * window.innerHeight + offset;
        const dir = target > this.scrollPos ? 1 : -1;
        const val = Math.abs(target - this.scrollPos) / 60;

        // if (index === 0) {
        //   this.instances[0].playIntroAnim();
        // }

        if (this.scrollAnim) cancelAnimationFrame(this.scrollAnim);

        const animate = () => {
            if (dir > 0) {
                if (this.scrollPos < target) {
                    this.addScroll(val);
                    this.scrollAnim = requestAnimationFrame(animate);
                } else {
                    this.scrollPos = target;
                    cancelAnimationFrame(animate);
                }
            } else if (dir < 0) {
                if (this.scrollPos > target) {
                    this.addScroll(-val);
                    this.scrollAnim = requestAnimationFrame(animate);
                } else {
                    this.scrollPos = target;
                    cancelAnimationFrame(animate);
                }
            }
        };

        this.scrollAnim = requestAnimationFrame(animate);
    }

    update() {
        if (!this.shouldUpdate) return;

        // get current active object
        const current = Math.floor(this.smoothScroll / window.innerHeight);
        const closest = Math.round(this.smoothScroll / window.innerHeight);

        // detect change in theme
        if (this.closest !== closest) {
            const closestInstance = this.instances[closest];
            if (closestInstance) {
                closestInstance.changeTheme();
                // track closest section
                // track.event(`Show_${closestInstance.name}`);
            }
            // sideNav.toggleActive(closest);
            this.closest = closest;
        }

        // calculate current progress between the two active instances
        const progress = getFractionBetween(
            this.smoothScroll % window.innerHeight,
            0,
            window.innerHeight
        );

        const currentInstance = this.instances[current];
        const nextInstance = this.instances[current + 1];

        // set in / out transition progress
        if (currentInstance) currentInstance.setProgressOut(progress);
        if (nextInstance) nextInstance.setProgressIn(progress);

        // check for animations
        if (this.dir > 0 && nextInstance?.animations && !this.hasStopped) {
            if (this.scrollPos >= nextInstance.origin) {
                this.scrollPos = nextInstance.origin;
                this.animInstance = nextInstance;
                this.hasStopped = true;
            }
        } else if (
            this.dir < 0 &&
            currentInstance?.animations &&
            !this.hasStopped
        ) {
            if (this.scrollPos <= currentInstance.origin) {
                this.scrollPos = currentInstance.origin;
                this.animInstance = currentInstance;
                this.hasStopped = true;
            }
        }

        // calculate new container position
        const newValue = this.scrollPos * camera.pxToUnits * M;
        this.container.position.y +=
            (newValue - this.container.position.y) * this.easing;

        // create a smoothscroll
        this.smoothScroll += (this.scrollPos - this.smoothScroll) * this.easing;

        // update/activate instances
        const diff = Math.abs(newValue - this.container.position.y);

        if (diff > EPSILON) {
            for (let instance of this.instances) {
                instance.update(this.smoothScroll);
            }
        }
    }
}

export default new  Controller();
