import renderer from './modules/renderer';
import scene from './modules/scene';
import camera from './modules/camera';
import * as assetList from './assetlist.js';
import WebGL from "./modules/index.js";
import loader from "@/modules/WebGL/loader.js";
import controller from "@/modules/WebGL/controller.js";
import sections from "@/modules/WebGL/sections.js";

export default function (dom,processDom, Progress = () => {},Complete=()=>{}) {
    renderer.renderDom(dom)
    loader.init(processDom)
    const onProgress = (p) => {
        const percent = Math.round(p * 100);
        Progress(percent)
    };
    const onComplete = () => {
        loader.complete(() => {
            Complete()
            controller.register(sections)
            new WebGL();
        });
    };

    assetList.loadAll(renderer, onProgress, onComplete);
}
