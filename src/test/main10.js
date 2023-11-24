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










// 添加物体

for (let i = 0; i < 50; i++) {
    const box = new THREE.BufferGeometry()
    let abc = new Float32Array(9)

    for (let j=0; j<9;j++){
        abc[j] = Math.random() * 10 - 5
    }

    box.setAttribute('position',new THREE.BufferAttribute(abc,3))

    let color = new THREE.Color(Math.random(),Math.random(),Math.random())

    const boxMaterIal = new THREE.MeshBasicMaterial({color: color,transparent:true,opacity:0.5})

    const a = new THREE.Mesh(box, boxMaterIal)

    scene.add(a)
}



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



































