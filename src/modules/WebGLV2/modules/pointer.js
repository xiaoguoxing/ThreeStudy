import touches from 'touches';
import { Vector2, Vector3 } from 'three';
import { viewport } from './viewport';
import dispatcher from "@/modules/WebGLV2/modules/dispatcher.js";
const defaults = {
    pos: [viewport.width * 0.5, viewport.height * 0.5],
    inertia: 0.05,
};
class Pointer {
    constructor() {
        this.emitter = touches(window, {
            preventSimulated: false,
        })
            .on('start', this.onStart)
            .on('move', this.onMove)
            .on('end', this.onEnd);

        const x = defaults.pos[0];
        const y = defaults.pos[0];
        const norm = this.convertNDC(defaults.pos);

        this.pos = new Vector2(x, y);
        this.startPos = new Vector2();
        this.prevPos = new Vector2(x, y);
        this.eased = new Vector2(x, y);
        this.norm = new Vector2(norm.x, norm.y);
        this.normEased = new Vector2(norm.x, norm.y);

        this.moveDelta = new Vector2();
        this.dragDelta = new Vector2();
        this.isDown = false;
    }
    onStart = (ev,pos) => {
        const norm = this.convertNDC(pos);
        this.pos.set(pos[0], pos[1]);
        this.norm.set(norm.x, norm.y);
    }
    onMove = (ev,pos) => {
        const norm = this.convertNDC(pos);
        this.isDown = true;
        this.pos.set(pos[0], pos[1]);
        this.norm.set(norm.x, norm.y);
        dispatcher.trigger(
            {
                name: 'pointerMove',
            },
            {
                pointer: this,
            }
        );
    }
    onEnd = () => {
        this.isDown = false;
    }
    convertNDC(pos) {
        const x = (pos[0] / viewport.width) * 2 - 1;
        const y = -(pos[1] / viewport.height) * 2 + 1;
        return {
            x,
            y,
        };
    }
    enable() {
        this.emitter.enable();
    }
    disable() {
        this.emitter.disable();
    }
    update() {
        this.eased.x += (this.pos.x - this.eased.x) * defaults.inertia;
        this.eased.y += (this.pos.y - this.eased.y) * defaults.inertia;
        this.normEased.x += (this.norm.x - this.normEased.x) * defaults.inertia;
        this.normEased.y += (this.norm.y - this.normEased.y) * defaults.inertia;
    }
}
export default new Pointer()
