import {Scene, Color, Fog} from 'three'
import gsap from "gsap";
import gui from "@/modules/WebGLV2/modules/gui.js";
class scene extends Scene{
    constructor() {
        super();
        this.fog = new Fog(0xcae0e0, 30, 35);
        let folder = gui.folder({title:'场景'})
        this.background = new Color('#cbe0e0');
        gui.add(this.fog,'near',{label:'near',  min:0,max:100},folder)
        gui.add(this.fog,'far',{label:'far',  min:0,max:100},folder)
        gui.add(this,'background',{label:'背景',  color: {type: 'float'}},folder)
    }
    setFog(fog) {
        const near = fog ? fog.near : 100;
        const far = fog ? fog.far : 100;
        gsap.to(this.fog, { near, far, duration: 1 });
    }
}
export default new scene()
