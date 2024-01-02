import {Object3D} from "three";
import {component} from "@/modules/WebGLV2/modules/dispatcher.js";

export default class baseInstance extends component(Object3D){
    constructor(data) {
        super(data);
        this.name = data.name+'123';
        this.el = data.el;
        this.theme = data.theme;
        this.fog = data.fog;
        console.log(this);
    }
}
