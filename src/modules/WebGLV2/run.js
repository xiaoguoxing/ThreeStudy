import {loadAll} from "@/modules/WebGLV2/assetlist.js";
import renderer from '@/modules/WebGLV2/modules/renderer.js'
import loader from '@/modules/WebGLV2/loader.js'


export default class Run {
    render = null
    options = {
        progressDom:null,
        Progress : ()=>{},
        Complete : ()=>{}
    }
    constructor(dom,options) {
        this.options = {...this.options,...options}
        this.render = new renderer(dom)
        loader.setEl(this.options.progressDom);
        loadAll(this.render,this.#onProgress,this.#onComplete)
    }
    #onProgress = (p) => {
        const percent = Math.round(p * 100);
        this.options.Progress(percent);
    }
    #onComplete = ()=> {
        loader.complete(() => {
            this.options.Complete();
        });
    }
}
