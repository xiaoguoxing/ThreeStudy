<script setup>
import Viewer from '@/modules/Viewer'
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import gsap from 'gsap'
let viewer;
let count = 5000
let timeClock = new THREE.Clock()
onMounted(() => {
  init()
  initPoints()
})
function init() {
  viewer = new Viewer('three',false)
  viewer.camera.position.set(0, .4, 10);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);
  viewer.camera.near = 0.01
  viewer.camera.far = 15/2
  viewer.initRaycaster();
  // viewer.addAxis()
}

function initPoints(){
  let points1 = createPoints('circle_05')
  let points2 = createPoints()

  viewer.addAnimate({
    fun(){
      let time = timeClock.getElapsedTime()
      points1.rotation.x = time * 0.05
      points2.rotation.x = time * 0.1
      points2.rotation.y = time * 0.05
    },
    content:viewer
  })
}

function createPoints(url='xuehua',size=0.2){
  let pointTextureLoad = new THREE.TextureLoader()
  let pointTexture = pointTextureLoad.load(`/points/${url}.png`)

  let geometry = new THREE.BufferGeometry()
  let position = new Float32Array(count*3)
  let colors = new Float32Array(count*3)
  for (let i = 0; i < count*3; i++) {
    position[i] = (Math.random() - 0.5) * 15
    colors[i] = 1
  }
  geometry.setAttribute('position',new THREE.BufferAttribute(position,3))
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

  let material = new THREE.PointsMaterial({
    size:size,
    // color:0xff0000,
    vertexColors:true,
    map:pointTexture,
    alphaMap:pointTexture,
    transparent:true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  let points = new THREE.Points(geometry,material)

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
