/**
 * This is the class responsible for keeping track
 * of mouse / touch movements
 *
 * Options for touches:
 * target: the element to use when calculating the position parameter passed to event listeners. The clientX/clientY of the event will be relative to this target
 * filtered: whether the touch events should be filtered to the first placed finger
 * type: can be a string, either "mouse" or "touch" if listening to only one or the other event is desired. If any other value, will listen for both mouse and touch.
 * preventSimulated: (default true) if true, prevents simulated touch events by running ev.preventDefault() on 'touchend' events
 */

import touches from 'touches';
import dispatcher, { component } from './dispatcher';
import { Vector2, Vector3 } from 'three';
import { viewport } from './viewport';

// set default pos to the center of the screen
const defaults = {
    pos: [viewport.width * 0.5, viewport.height * 0.5],
    inertia: 0.05,
};

class Pointer {
    constructor() {
        this.emitter = touches(document.querySelector('.content'), {
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

    enable() {
        this.emitter.enable();
    }

    disable() {
        this.emitter.disable();
    }

    convertNDC(pos) {
        const x = (pos[0] / viewport.width) * 2 - 1;
        const y = -(pos[1] / viewport.height) * 2 + 1;
        return {
            x,
            y,
        };
    }

    onStart = (evt, pos) => {
        const norm = this.convertNDC(pos);
        this.pos.set(pos[0], pos[1]);
        this.norm.set(norm.x, norm.y);
        this.startPos.set(pos[0], pos[1]);
        this.prevPos.copy(this.startPos);
        this.dragDelta.set(0, 0);
        this.moveDelta.set(0, 0);

        this.isDown = true;

        dispatcher.trigger(
            {
                name: 'pointerDown',
            },
            {
                pointer: this,
            }
        );
    };

    onMove = (evt, pos) => {
        const norm = this.convertNDC(pos);

        this.pos.set(pos[0], pos[1]);
        this.norm.set(norm.x, norm.y);
        this.moveDelta.subVectors(this.prevPos, this.pos);

        dispatcher.trigger(
            {
                name: 'pointerMove',
            },
            {
                pointer: this,
            }
        );

        if (this.isDown) {
            this.dragDelta.subVectors(this.startPos, this.pos);

            dispatcher.trigger(
                {
                    name: 'pointerDrag',
                },
                {
                    pointer: this,
                    evt,
                }
            );
        }

        this.prevPos.copy(this.pos);
    };

    onEnd = () => {
        this.isDown = false;

        dispatcher.trigger(
            {
                name: 'pointerUp',
            },
            {
                pointer: this,
            }
        );

        if (this.dragDelta.distanceTo(new Vector3()) < 1) {
            dispatcher.trigger(
                {
                    name: 'pointerClick',
                },
                {
                    pointer: this,
                }
            );
        }
    };

    // calculate intertia/easing
    update() {
        this.eased.x += (this.pos.x - this.eased.x) * defaults.inertia;
        this.eased.y += (this.pos.y - this.eased.y) * defaults.inertia;
        this.normEased.x += (this.norm.x - this.normEased.x) * defaults.inertia;
        this.normEased.y += (this.norm.y - this.normEased.y) * defaults.inertia;
    }
}

export default new Pointer();
