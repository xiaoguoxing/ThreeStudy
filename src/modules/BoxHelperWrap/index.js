import {  BoxHelper, Color, Object3D}from 'three'
export default class BoxHelperWrap{
    viewer = null
    boxHelper = null
    constructor(viewer,color) {
        this.viewer = viewer
        const boxColor = color === undefined ? 0x00ffff : color;
        this.boxHelper = new BoxHelper(new Object3D(), new Color(boxColor));
        this.#init()
    }
    #init(){
        this.viewer.scene.add(this.boxHelper)
    }
    setVisible (visible) {
        this.boxHelper.visible = visible;
    }
    attach (obj) {
        this.boxHelper.setFromObject(obj);
        this.setVisible(true);
    }
    dispose () {
        const parent = this.boxHelper.parent;
        if (parent !== null) {
            parent.remove(this.boxHelper);
        }

        Object.keys(this).forEach(key => {
            // @ts-expect-error
            this[key] = null;
        });
    }
}
