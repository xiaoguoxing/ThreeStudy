import {Scene, PerspectiveCamera, WebGLRenderer, SRGBColorSpace, AmbientLight, AxesHelper,Raycaster, Color,Vector2} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import Events,{EventBus} from "@/modules/Viewer/Events";
import SkyBoxs from "@/modules/SkyBoxs";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as THREE from 'three'
export default class Viewer {
    id = ''
    viewerDom = ''
    scene = null
    renderer = null
    camera = null
    controls = null
    statsControls = null
    isDestroy = false
    animateEventList = []
    raycaster = null
    raycasterObjects = []
    mouse = {}
    mouseEvent = {}
    EventBus = null
    skyboxs = null
    pointerLockControls = null
    isDefaultControls = true
    constructor(id = '',isDefaultControls=true) {
        this.id = id
        this.isDefaultControls = isDefaultControls
        this.#initViewer()
    }
    addAxis() {
        const axis = new AxesHelper(5);
        this.scene?.add(axis);
    }
    addStats() {
        if (!this.statsControls) this.statsControls = new Stats();
        this.statsControls.dom.style.position = 'absolute';
        this.viewerDom.appendChild(this.statsControls.dom);

        // 添加到动画
        this.addAnimate({
            fun: this.#statsUpdate,
            content: this.statsControls,
        });
    }
    #statsUpdate(statsControls) {
        statsControls.update();
    }
    addAnimate(animate) {
        this.animateEventList.push(animate);
    }
    initRaycaster(){
        this.raycaster = new Raycaster()
        const initRaycasterEvent = (eventName) => {
            const funWrap = (event) => {
                    this.mouseEvent = event;
                    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                    // @ts-expect-error
                    this.EventBus.emit(Events[eventName].raycaster, this.#getRaycasterIntersectObjects());
                }
            this.renderer.domElement.addEventListener(eventName, funWrap, false);
        };

        initRaycasterEvent('click');
        initRaycasterEvent('dblclick');
        initRaycasterEvent('mousemove');
    }
    setRaycasterObjects (objList) {
        this.raycasterObjects.push(...objList);
    }
    #getRaycasterIntersectObjects(){
        if (!this.raycasterObjects.length) return [];
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(this.raycasterObjects, true);
    }
    destroy() {
        this.scene.traverse((child) => {
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
            child = null;
        });
        this.renderer.forceContextLoss();
        this.renderer.dispose();
        this.scene.clear();

        this.isDestroy = true;
    }
    #initViewer() {
        this.EventBus = new EventBus()
        this.#initRender()
        this.#initScene()
        this.#initLight()
        this.#initCamera()
        if(this.isDefaultControls) this.#initControl();
        this.#initSkybox()
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        const animate = () => {
            if (this.isDestroy) return;
            requestAnimationFrame(animate);
            this.#updateDom();
            this.#readerDom();
            // 全局的公共动画函数，添加函数可同步执行
            this.animateEventList.forEach(event => {
                // event.fun && event.content && event.fun(event.content);
                if (event.fun && event.content) {
                    event.fun(event.content);
                }
            });
        };

        animate();
    }
    #initRender() {
        this.viewerDom = document.getElementById(this.id);
        // 初始化渲染器
        this.renderer = new WebGLRenderer({
            logarithmicDepthBuffer: true,
            antialias: true, // true/false表示是否开启反锯齿
            alpha: true, // true/false 表示是否可以设置背景色透明
            precision: 'mediump', // highp/mediump/lowp 表示着色精度选择
            premultipliedAlpha: true, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
            // preserveDrawingBuffer: false, // true/false 表示是否保存绘图缓冲
            // physicallyCorrectLights: true, // true/false 表示是否开启物理光照
        });
        this.renderer.clearDepth();
        this.renderer.shadowMap.enabled = true;
        this.viewerDom.appendChild(this.renderer.domElement);
    }
    #initScene() {
        this.scene = new Scene()
        // this.scene.background = new Color('#0C1B2E')
        this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    }
    #initLight() {
        const ambient = new AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const light = new THREE.DirectionalLight( 0xffffff,5 );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;

        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 400;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 400;
        // 设置mapSize属性可以使阴影更清晰，不那么模糊
        light.shadow.mapSize.set(1024, 1024);

        this.scene.add(light);

    }
    #initCamera() {
        // 渲染相机
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, undefined, 1000);

        // const helper = new THREE.CameraHelper( this.camera );
        // this.scene.add( helper );
    }
    #initControl() {
        this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
        this.controls.enableDamping = false;
        this.controls.screenSpacePanning = false; // 定义平移时如何平移相机的位置 控制不上下移动
        this.controls.minDistance = 0;
        this.controls.maxDistance = 1000;
        this.controls.addEventListener('change', ()=>{
            this.renderer.render(this.scene, this.camera);
        });
    }
    #initSkybox() {
        if (!this.skyboxs) this.skyboxs = new SkyBoxs(this);
        this.skyboxs.addSkybox('night');
        this.skyboxs.addFog();
    }
    initPointerLockControls(){
        this.pointerLockControls = new PointerLockControls(this.camera, this.renderer?.domElement)
        this.scene.add(this.pointerLockControls.getObject())
        return this.pointerLockControls
    }
    #readerDom() {
        this.renderer?.render(this.scene,this.camera);
    }
    #updateDom() {
        this.controls?.update();
        // 更新参数
        this.camera.aspect = this.viewerDom.clientWidth / this.viewerDom.clientHeight; // 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高
        this.camera.updateProjectionMatrix(); // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用,来使得这些改变生效
        this.renderer.setSize(this.viewerDom.clientWidth, this.viewerDom.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
    }
}
