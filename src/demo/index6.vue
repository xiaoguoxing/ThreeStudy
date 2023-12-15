<script setup>
import Viewer from '@/modules/Viewer'
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import gsap from 'gsap'

let viewer;
let count = 10000
let timeClock = new THREE.Clock()
onMounted(() => {
  init()
  initPoints()
})

function init() {
  viewer = new Viewer('three')
  viewer.camera.position.set(5, 5, 5);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);
  // viewer.camera.near = 0.01
  // viewer.camera.far = 15/2
  viewer.initRaycaster();
  // viewer.addAxis()
}

function initPoints() {
  let points1 = createPoints('circle_05')
  // let points2 = createPoints()

  viewer.addAnimate({
    fun() {
      let time = timeClock.getElapsedTime()
      // points1.rotation.x = time * 0.05
      // points2.rotation.x = time * 0.1
      points1.rotation.y = time * 0.1
    },
    content: viewer
  })
}

function createPoints(url = 'xuehua', size = 0.1, b = 6, rotate = 0.3,R = 5) {
  let pointTextureLoad = new THREE.TextureLoader()
  let pointTexture = pointTextureLoad.load(`/points/${url}.png`)

  let geometry = new THREE.BufferGeometry()
  let position = new Float32Array(count * 3)

  let colors = new Float32Array(count*3)
  // let startColor = new THREE.Color( '#ff0000')
  // let endColor = new THREE.Color( '#ffffff')
  let startColor = new THREE.Color( '#ff6030')
  let endColor = new THREE.Color( '#1b3984')
  let a = new THREE.Color()
  for (let i = 0; i < count; i++) {

    let current = i * 3

    let b1 = (i % b) * ((2 * Math.PI) / b) //角度

    let d = (Math.random()) * R * Math.pow(Math.random(),3) //半径

    let randomX = (Math.pow(Math.random()*2-1,3) * (R - d) / 5 )
    let randomY = (Math.pow(Math.random()*2-1,3) * (R - d) / 5 )
    let randomZ = (Math.pow(Math.random()*2-1,3) * (R - d) / 5 )

    position[current] = Math.cos(b1 + d * rotate) * d + randomX
    position[current + 1] = randomY
    position[current + 2] = Math.sin(b1 + d * rotate) * d + randomZ


    a.lerpColors(startColor,endColor,d / R / 0.6)


    colors[current] = a.r
    colors[current+1] = a.g
    colors[current+2] = a.b
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

  let material = new THREE.PointsMaterial({
    size: size,
    // color:'#fff',
    vertexColors:true,
    map: pointTexture,
    alphaMap: pointTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  let points = new THREE.Points(geometry, material)
  viewer.scene.add(points)
  return points
}


</script>
<template>
  <div id="three"></div>
</template>
<style scoped>
#three {
  position: relative;
  width: 100vw;
  height: 100vh;

}
</style>
