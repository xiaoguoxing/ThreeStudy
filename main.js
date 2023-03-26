import * as Three from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const scene = new Three.Scene()

const axes = new Three.AxesHelper(5)

scene.add(axes)

const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000)

camera.position.set(0,0,10)

scene.add(camera)

//添加物体

const box = new Three.BoxGeometry()
const boxMaterIal = new Three.MeshBasicMaterial({color:'#fff'})
const  a = new Three.Mesh(box,boxMaterIal)

// a.scale.set(3,2,1)
// a.scale.x = 5

// a.rotation.set(Math.PI/4,0,0,'XZY')

scene.add(a)

//初始化渲染器

const render = new Three.WebGLRenderer()

render.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(render.domElement);


const Controls = new OrbitControls(camera,render.domElement)

const clock = new Three.Clock()

function R1(time){
    // console.log(time);
    // a.position.x += 0.01
    // a.rotation.y += 0.01

    let t = clock.getElapsedTime()

    let deltaTime = clock.getDelta()

    // console.log('总时长',t);
    // console.log('间隔时间',deltaTime);



    a.position.x = t % 5

    // a.rotation.y += t


    render.render(scene,camera)
    requestAnimationFrame(R1)
}

R1()














































