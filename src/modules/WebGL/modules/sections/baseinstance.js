import { Object3D } from 'three';
import { component } from '../dispatcher';

export default class BaseInstance extends component(Object3D) {
    constructor({ name, el, theme, fog }) {
        super({ name, el, theme, fog });
        this.name = name;
        this.el = el;
        this.theme = theme;
        this.fog = fog;
    }

    setOrigin(origin, pos) {
        // this.origin = origin;
        this.position.y = pos;
    }

    setabc(){
    }
}
