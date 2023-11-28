<script setup>
import Viewer from '@/modules/Viewer'
import ModelLoader from '@/modules/ModelLoader'
import * as THREE from 'three'
import {onMounted} from "vue";
import {checkNameIncludes} from "@/utils";
import Events from "@/modules/Viewer/Events";
let viewer,modelLoader;
let dataCenter,oldDataCenter;
onMounted(()=>{
  init()
  initModel()
})
function init(){
  viewer = new Viewer('three')
  viewer.initRaycaster();
  modelLoader = new ModelLoader(viewer);
  viewer.addAxis()
  // viewer.addStats()
  viewer.EventBus.on(Events.dblclick.raycaster,(list) => {
    // console.log(list);
  })
}
function initModel(){
  modelLoader.loadModelToScene('/models/index3/plane.glb', baseModel => {
    const model = baseModel.gltf.scene;
    model.scale.set(0.0001 * 3, 0.0001 * 3, 0.0001 * 3)
    model.position.set(0, 0, 0);
    model.name = 'plane';
    baseModel.openCastShadow();
    let material = (baseModel.object.children[0]).material
    const texture = material.map;
    const fnOnj = planeAnimate(texture);
    viewer.addAnimate(fnOnj);
  });
  modelLoader.loadModelToScene('/models/index3/datacenter.glb', baseModel => {
    baseModel.setScale(0.2);
    // baseModel.object.rotation.y = Math.PI / 2;
    const model = baseModel.gltf.scene;
    model.position.set(0, 0, 0);
    model.name = '机房';
    baseModel.openCastShadow();

    dataCenter = baseModel;
    oldDataCenter = model.clone();

    const rackList= [];
    model.traverse(item => {
      if (checkIsRack(item)) {
        rackList.push(item);
      }
    });
    viewer.setRaycasterObjects(rackList);
  });
}
const planeAnimate = (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const animateFn = {
    fun: () => {
      const count = texture.repeat.y;
      if (count <= 5) {
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
function checkIsRack (obj) {
  return checkNameIncludes(obj, 'rack');
}
</script>

<template>
  <div id="three"></div>
</template>

<style scoped>
#three{
  width: 100vw;
  height: 100vh;
}
</style>
