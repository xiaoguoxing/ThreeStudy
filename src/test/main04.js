import * as THREE from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

// 场景
const scene = new THREE.Scene()

const axes = new THREE.AxesHelper(5)

scene.add(axes)
// 相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000)

camera.position.set(0,0,10)

scene.add(camera)

//初始化渲染器

const render = new THREE.WebGLRenderer()

render.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(render.domElement);

//添加物体

const box = new THREE.BoxGeometry()
const boxMaterIal = new THREE.MeshBasicMaterial({color:'#fff'})
const  a = new THREE.Mesh(box,boxMaterIal)

// a.scale.set(3,2,1)
// a.scale.x = 5

// a.rotation.set(Math.PI/4,0,0,'XZY')

scene.add(a)
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, -10, 0 ) );
points.push( new THREE.Vector3( -10, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, lineMaterial );

scene.add(line)



const Controls = new OrbitControls(camera,render.domElement)

const clock = new THREE.Clock()

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



if (WebGL.isWebGLAvailable()) {
    R1()
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}












































