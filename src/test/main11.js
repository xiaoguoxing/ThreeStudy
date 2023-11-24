


import * as THREE from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import {gsap} from "gsap";
import * as dat from "dat.gui";

import blueImg from '../../assets/images/blue.jpg'

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






//纹理
const abc = new THREE.TextureLoader()
const blueI = abc.load(blueImg)
// blueI.offset.set(0.5,0.5)
blueI.center.set(0.5, 0.5)
blueI.rotation = 0
blueI.repeat.set(2,3)

blueI.wrapS =THREE.MirroredRepeatWrapping

blueI.wrapT =THREE.RepeatWrapping
// 添加物体
const box = new THREE.BoxBufferGeometry(5,5,5)

let color = new THREE.Color(Math.random(),Math.random(),Math.random())

const boxMaterIal = new THREE.MeshBasicMaterial({
    map:blueI,
})

const a = new THREE.Mesh(box, boxMaterIal)

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















