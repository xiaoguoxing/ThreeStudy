import { DirectionalLight, AmbientLight } from 'three';
export default function (){
    //blue
    let light = new DirectionalLight(0x4af2d4, 1.3);
    light.position.set(-100, -10, -10);
    //yellow
    let light2 = new DirectionalLight(0xff7e00, 1.2);
    light2.position.set(100, -10, -20);

    let light3 = new DirectionalLight(0xffffff, 1.2);
    light3.position.set(50, 50, 20);

    let ambient = new AmbientLight(0xffffff, 1.3);
    return [
        light,
        light2,
        light3,
        ambient
    ]
}
