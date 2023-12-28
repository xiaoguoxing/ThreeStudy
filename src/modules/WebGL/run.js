import * as assetList from './assetlist.js';
import WebGL from "./modules/index.js";
import renderer from './modules/renderer';
import loader from "@/modules/WebGL/loader.js";
import controller from "@/modules/WebGL/controller.js";
import sections from "@/modules/WebGL/sections.js";

export default class run {
    Progress = ()=>{}
    Complete = ()=>{}
    constructor(dom,processDom, Progress = () => {},Complete=()=>{}) {
        this.Progress = Progress;
        this.Complete = Complete;
        renderer.renderDom(dom);
        loader.init(processDom);
        assetList.loadAll(renderer, this.onProgress, this.onComplete);
    }
    onProgress = (p) => {
        const percent = Math.round(p * 100);
        this.Progress(percent);
    }
    onComplete = () => {
        loader.complete(() => {
            controller.register(sections);
            this.Complete();
            new WebGL();
        });
    }
}
