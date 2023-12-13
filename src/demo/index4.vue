<script setup>
import Viewer from '@/modules/Viewer'
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import gsap from 'gsap'
let pointTextureLoad = new THREE.TextureLoader()
let pointTexture = pointTextureLoad.load('/points/circle_05.png')
let viewer;
let count = 5000
let geometry = new THREE.BufferGeometry()
let position = new Float32Array(count*3)
let colors = new Float32Array(count*3)
for (let i = 0; i < count*3; i++) {
  position[i] = (Math.random() - 0.5) * 5
  colors[i] = Math.random()
}
geometry.setAttribute('position',new THREE.BufferAttribute(position,3))
geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

let material = new THREE.PointsMaterial({
  size:0.1,
  // color:0xff0000,
  vertexColors:true,
  // map:pointTexture,
  alphaMap:pointTexture,
  transparent:true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

let points = new THREE.Points(geometry,material)

onMounted(() => {
  init()
})
function init() {
  viewer = new Viewer('three')
  viewer.camera.position.set(0, .4, 2);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);
  viewer.initRaycaster();
  viewer.addAxis()
  viewer.scene.add(points)
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
