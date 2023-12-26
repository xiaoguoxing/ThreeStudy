import { Object3D } from 'three';
import gsap from 'gsap';
import dispatcher, { component } from '../dispatcher';

import { remap, clamp } from '@/utils';
import scene from '../scene';

// padding in pixels on top/bottom before activating/deactivating
const ACTIVE_PADDING = 10;

export default class BaseInstance extends component(Object3D) {
    constructor({ name, el, theme, fog }) {
        super({ name, el, theme, fog });

        this.name = name;
        this.el = el;
        this.theme = theme;
        this.fog = fog;
        this.active = false;
        this.animProgress = 0;
        this.animProgressEased = 0;
        this.currentEvent = null;

        dispatcher.on('raf', () => {
            if (this.active && this.animations && this.cb) {
                this.animProgressEased +=
                    (this.animProgress - this.animProgressEased) * 0.05;

                if (this.animProgressEased > this.totalAnimFrames) {
                    this.animProgressEased = this.animProgress = this.totalAnimFrames;
                    this.cb(true);
                } else if (this.animProgressEased < 0) {
                    this.animProgressEased = this.animProgress = 0;
                    this.cb(true);
                }

                this.renderAnimations();
            }
        });
    }

    setOrigin(origin, pos) {
        this.origin = origin;
        this.position.y = pos;
    }

    calculateAnimationFrames() {
        let total = 0;
        for (let anim of this.animations) {
            if (anim.to > total) total = anim.to;
        }
        return total;
    }

    setProgressIn(p) {
        if (this.inAnim) this.inAnim.progress(p);
    }

    setProgressOut(p) {
        if (this.outAnim) this.outAnim.progress(p);
    }

    setAnimProgress(val) {
        this.animProgress = this.animProgressEased = Math.round(
            val * this.totalAnimFrames
        );
    }

    renderAnimations() {
        for (let anim of this.animations) {
            const { from, to, instance, events } = anim;
            // calculate  progress
            if (this.animProgressEased >= from && this.animProgressEased <= to) {
                const p = remap(this.animProgressEased, from, to, 0, 1);
                instance.progress(p);

                if (events && events.length) {
                    for (let evt of events) {
                        const { progress, event } = evt;

                        if (
                            p > progress[0] &&
                            p < progress[1] &&
                            this.currentEvent !== evt
                        ) {
                            this.currentEvent = evt;
                            if (this.onProgressEvent) this.onProgressEvent(event);
                        }
                    }
                }
            }
        }
    }

    updateAnimations(val, cb) {
        if (this.animations) {
            this.animProgress += val;
            this.cb = cb;
        } else {
            cb(true);
        }
    }

    update(pos) {
        const diff = Math.abs(this.origin - pos);
        if (diff <= window.innerHeight - ACTIVE_PADDING) {
            this.setActive(true);
        } else {
            this.setActive(false);
        }
    }

    setActive(boo) {
        if ((this.active && boo) || (!this.active && !boo)) return;

        // console.log(`Activating ${this.name}: ${boo}`);

        this.el.forEach((item) => {
            if (boo) gsap.set(item, { display: 'block' });
            else gsap.set(item, { display: 'none' });
        });

        this.active = boo;
        this.visible = boo;
    }

    changeTheme() {
        scene.setTheme(this.theme);
        scene.setFog(this.fog);
    }

    closeHotspots() {
        if (this.hotspots) this.hotspots.closeActive();
    }
}
