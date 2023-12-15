<script setup>
import Viewer from '@/modules/Viewer'
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import gsap from 'gsap'
import events from "@/modules/Viewer/Events";
import Events from "@/modules/Viewer/Events";

let viewer;
let count = 100
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
  viewer.addAxis()
  viewer.EventBus.on(Events.mousemove.raycaster, (list) => {
    // console.log(list);
    onMouseMove(list)
  })
}

function initPoints() {
  let Box = createBox()
  // let points2 = createPoints()

  viewer.addAnimate({
    fun() {
      let time = timeClock.getElapsedTime()
      // points1.rotation.x = time * 0.05
      // points2.rotation.x = time * 0.1
      // points1.rotation.y = time * 0.1
    },
    content: viewer
  })
}

function createBox() {


  let geometry = new THREE.BoxGeometry(2, 2, 2)

  let material = new THREE.MeshBasicMaterial({
    wireframe: true
  })



  let RayCasterArr = []
  for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
      for (let z = -5; z < 5; z++) {
        let Mesh = new THREE.Mesh(geometry, material)
        Mesh.position.set(x,y,z)
        RayCasterArr.push(Mesh)
        viewer.scene.add(Mesh)
      }
    }
  }

  viewer.setRaycasterObjects(RayCasterArr,true)
  return RayCasterArr
}

function onMouseMove(list) {
  let RedMaterial = new THREE.MeshBasicMaterial({
    color:'#ff0000',
    wireframe:true,
  })
  list.forEach(i=>{
    i.object.material = RedMaterial
  })
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
