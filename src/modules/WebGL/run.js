import renderer from './modules/renderer';
import scene from './modules/scene';
import camera from './modules/camera';
import * as assetList from './assetlist.js';
import WebGL from "./modules/index.js";
import loader from "@/modules/WebGL/loader.js";
import controller from "@/modules/WebGL/controller.js";


export default function (dom,processDom, Progress = () => {},Complete=()=>{}) {
    loader.init(processDom)
    controller.init(document.querySelector('.container'))
    const onProgress = (p) => {
        const percent = Math.round(p * 100);
        Progress(percent)
    };
    const onComplete = () => {
        loader.complete(() => {
            Complete()
            new WebGL();
        });
    };
    renderer.render(scene, camera);
    dom.appendChild(renderer.domElement)
    assetList.loadAll(renderer, onProgress, onComplete);
}
