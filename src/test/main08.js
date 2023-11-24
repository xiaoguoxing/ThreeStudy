import * as THREE from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import {gsap} from "gsap";
import * as dat from "dat.gui";

const clock = new THREE.Clock()

// 场景
const scene = new THREE.Scene()

const axes = new THREE.AxesHelper(10)

scene.add(axes)
// 相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000)

camera.position.set(0, 0, 10)

scene.add(camera)

//初始化渲染器

const render = new THREE.WebGLRenderer()

render.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(render.domElement);
//轨道控制器
const Controls = new OrbitControls(camera, render.domElement)

Controls.enableDamping = true
//添加物体

const box = new THREE.BoxGeometry()
const boxMaterIal = new THREE.MeshBasicMaterial({color: '#fff'})
const a = new THREE.Mesh(box, boxMaterIal)

// a.scale.set(3,2,1)
// a.scale.x = 5

// a.rotation.set(Math.PI/4,0,0,'XZY')

scene.add(a)
const lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});

const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
points.push(new THREE.Vector3(0, -10, 0));
points.push(new THREE.Vector3(-10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, lineMaterial);

scene.add(line)


let an = gsap.to(a.position, {
    x: 10, duration: 3, ease: 'power1.inOut',
    onStart() {
        console.log('开始了1')
    },
    onComplete() {
        console.log('完成了1')
    },
    yoyo: true,
    repeat: -1
})
window.addEventListener('dblclick', () => {
    if (an.isActive()) {
        an.pause()
    } else {
        an.resume()
    }
})

window.addEventListener('keydown', (e) => {
    const element = e
    if (e.code === 'KeyS') {
        if (!window.fullscreenElement) {
            render.domElement.requestFullscreen()
        } else {
            if (document.exitFullScreen) {
                document.exitFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        }
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    render.setSize(window.innerWidth, window.innerHeight)

    render.setPixelRatio(window.devicePixelRatio)
})

function R1(time) {
    Controls.update()
    render.render(scene, camera)
    requestAnimationFrame(R1)
}


if (WebGL.isWebGLAvailable()) {
    R1()
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

const gui = new dat.GUI()

const params = {
    color:'#f60',
    fn(){
        gsap.to(a.rotation, {
            x: 2 * Math.PI, duration: 5, ease: 'power1.inOut',
            onStart() {
                console.log('开始了2')
            },
            onComplete() {
                console.log('完成了2')
            },
            repeat: -1,

        })
    }
}

let folder = gui.addFolder('设置立方体')
folder.add(a.position,'y').min(0).max(5).step(0.01).name('box').onChange(value=>{
    console.log('值被修改了',value);
}).onFinishChange(value=>{
    console.log('完全停下来',value)
})

folder.add(a.material,'wireframe')

folder.addColor(params,'color').onChange(value=>{
    a.material.color.set(value)
})

folder.add(a,'visible').name('是否显示')

folder.add(params,'fn').name('点击运动')


































