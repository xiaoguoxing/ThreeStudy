import {loadAll} from "@/modules/WebGLV2/assetlist.js";
import renderer from '@/modules/WebGLV2/modules/renderer.js'
import loader from '@/modules/WebGLV2/loader.js'
import viewer from "@/modules/WebGLV2/viewer/index.js";

export default class Run {
    render = null
    view = null
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
            this.view = new viewer()
            this.render.setViewModel(this.view.newView)
        });
    }
    destroy(){
        this.render.destroyAll()
        this.view.destroyView()
    }
}
