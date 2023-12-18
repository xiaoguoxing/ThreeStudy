<script setup>
import Viewer from '@/modules/Viewer'
import ModelLoader from '@/modules/ModelLoader'
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import gsap from 'gsap'
import Events from "@/modules/Viewer/Events";

let viewer, modelLoader;
let count = 100
let timeClock = new THREE.Clock()

let texture = new THREE.TextureLoader()


onMounted(() => {
  init()
  initModel()
})

function init() {
  viewer = new Viewer('three', false)
  modelLoader = new ModelLoader(viewer)
  viewer.camera.position.set(0, 0, 8);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);
  // viewer.camera.near = 0.01
  // viewer.camera.far = 15/2
  viewer.initRaycaster();
  // viewer.addAxis()
  viewer.EventBus.on(Events.mousemove.raycaster, (list) => {
    // console.log(list);
    onMouseMove(list)
  })
}

function initModel() {
  modelLoader.loadModelToScene('/weedensenteret/plant2.glb', baseModel => {
    console.log(baseModel);
    const model = baseModel.object;
    const plant = model.children[0];
    const stem = plant.getObjectByName('stem');
    const bud = plant.getObjectByName('bud');
    const leaf = plant.getObjectByName('leaf_combined');
    leaf.material = new THREE.MeshBasicMaterial({
      map: texture.load('/weedensenteret/plant-texture.jpg'),
      color: 'white',
      alphaMap: texture.load('/weedensenteret/plant-alpha.png'),
      alphaTest: 0.9,
    });
    const budStemMaterial = new THREE.MeshBasicMaterial({
      map: texture.load('/weedensenteret/stem-bud-texture.jpg'),
      color: 'white',
    });

    stem.material = budStemMaterial
    bud.material = budStemMaterial

    plant.scale.set(1300, 1300, 1300);
    plant.position.set(0, -2.5, 0);

    viewer.addAnimate({
      content: viewer,
      fun() {
        let a = timeClock.getDelta()
        let event = viewer.mouse
        model.rotation.y = -(event.x * 0.4);
        model.rotation.x = -(event.y * 0.4);
      }
    })
  })
}

const planeAnimate = (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const animateFn = {
    fun: () => {
      const count = texture.repeat.y;
      if (count <= 10) {
        texture.repeat.x += 0.01;
        texture.repeat.y += 0.02;
      } else {
        texture.repeat.x = 0;
        texture.repeat.y = 0;
      }
    },
    content: viewer,
  };
  return animateFn;
}

function onMouseMove(list) {
  // console.log(list);
  let event = viewer.mouse
  let model = list[0]?.object?.parent
  if (model) {
    // viewer.camera.position.set(event.x, event.y, 8);
    // model.rotation.z = event.y
    // model.rotation.x = event.x
    // model.rotation.y = event.x
  }
}

</script>
<template>
  <div class="page page1"></div>
  <div class="page page2"></div>
  <div class="page page3"></div>
  <div id="three"></div>
</template>
<style scoped>
#three {
  position: relative;
  width: 100vw;
  height: 100vh;

}
</style>
