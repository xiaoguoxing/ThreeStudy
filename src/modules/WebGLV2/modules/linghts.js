import { DirectionalLight, AmbientLight } from 'three';
import gui from "@/modules/WebGLV2/modules/gui.js";
export default function (){
    let Folder = gui.folder({title:'灯光'})
    //blue
    let light = new DirectionalLight(0x4af2d4, 1.3);
    light.position.set(-100, -10, -10);
    gui.add(light, 'intensity', { min: 0.1, max: 2 ,label: '绿光'}, Folder);
    //yellow
    let light2 = new DirectionalLight(0xff7e00, 1.2);
    light2.position.set(100, -10, -20);

    let light3 = new DirectionalLight(0xffffff, 1.2);
    light3.position.set(50, 50, 20);
    gui.add(light3, 'intensity', { min: 0.1, max: 2 ,label: '平行光'}, Folder);

    let ambient = new AmbientLight(0xffffff, 1.3);
    gui.add(ambient, 'intensity', { min: 0.1, max: 2,label: '环境光' }, Folder);
    return [
        light,
        light2,
        light3,
        ambient
    ]
}
