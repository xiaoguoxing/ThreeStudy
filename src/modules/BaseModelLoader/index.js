import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
export default class BaseModel {
    viewer = null
    gltf = null
    object = null
    clock = null

    animaIndex = -1
    animaObject = null
    mixer = null

    isSaveMaterial = false
    originMaterials = []

    constructor(gltf, viewer) {
        this.viewer = viewer
        this.gltf = gltf
        this.object = gltf.scene || gltf
        this.clock = new THREE.Clock();
    }
    setScale(x, y, z) {
        this.object.scale.set(x, y || x, z || x);
    }
    getLength() {
        const box = new THREE.Box3();
        // 用来计算包围盒的3D对象
        box.setFromObject(this.object);
        //返回包围盒的宽度，高度，和深度。
        return box.getSize(new THREE.Vector3());
    }
    startAnima(i = 0) {
        this.animaIndex = i;
        if (!this.mixer) this.mixer = new THREE.AnimationMixer(this.object);
        if (this.gltf.animations.length < 1) return;
        this.mixer.clipAction(this.gltf.animations[i]).play();
        // 传入参数需要将函数与函数参数分开，在运行时填入
        this.animaObject = {
            fun: this.#updateAnima,
            content: this,
        };
        this.viewer.addAnimate(this.animaObject);
    }
    #updateAnima(e) {
        e.mixer.update(e.clock.getDelta());
    }
    cloneModel([x, y, z] = [0, 0, 0]) {
        const newScene = { ...this.gltf };
        const newModel = clone(this.object);
        newModel.position.set(x, y, z);
        this.viewer.scene.add(newModel);
        newScene.scene = newModel;
        return new BaseModel(newScene, this.viewer);
    }
    openCastShadow(names = []) {
        this.gltf.scene.traverse((model) => {
            if (model.isMesh && !names.includes(model.name)) {
                model.frustumCulled = false;
                model.castShadow = true;
            }
        });
    }
    setColor(color = 'yellow', opacity = 0.5) {
        if (!this.isSaveMaterial) this.originMaterials = [];
        this.gltf.scene.traverse((model) => {
            if (model.isMesh) {
                if (!this.isSaveMaterial) this.originMaterials.push(model.material);
                model.material = new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthTest: false,
                    depthWrite: true, // 无法被选择，鼠标穿透
                    color: new THREE.Color(color),
                    opacity: opacity,
                });
            }
        });
        this.isSaveMaterial = true;
    }
    setMaterial(material = new THREE.MeshBasicMaterial()) {
        if (!this.isSaveMaterial) this.originMaterials = [];
        this.gltf.scene.traverse((model) => {
            if (model.isMesh) {
                if (!this.isSaveMaterial) this.originMaterials.push(model.material);
                model.material = material;
            }
        });
        this.isSaveMaterial = true;
    }
    setDefault() {
        let i = 0;
        this.gltf.scene.traverse((model) => {
            if (model.isMesh) {
                model.material = this.originMaterials[i];
                i++;
            }
        });
    }
}
