import * as Three from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const scene = new Three.Scene()

const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000)

camera.position.set(0,0,10)

scene.add(camera)

//添加物体

const box = new Three.BoxGeometry()
const boxMaterIal = new Three.MeshBasicMaterial({color:0xffff00})
const  a = new Three.Mesh(box,boxMaterIal)
scene.add(a)

//初始化渲染器

const render = new Three.WebGLRenderer()

render.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(render.domElement);


const Controls = new OrbitControls(camera,render.domElement)

// Controls.update()

function R1(){
    render.render(scene,camera)
    requestAnimationFrame(R1)
}

R1()














































