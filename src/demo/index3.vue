<script setup>
import Viewer from '@/modules/Viewer'
import ModelLoader from '@/modules/ModelLoader'
import Floors from "@/modules/Floors";
import BoxHelperWrap from "@/modules/BoxHelperWrap";
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import {checkNameIncludes, findParent} from "@/utils";
import Events from "@/modules/Viewer/Events";
import gsap from 'gsap'
import { throttle } from 'lodash-es';
let viewer, modelLoader, floors, boxHelperWrap, pointerLockControls;
let dataCenter, oldDataCenter;
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5'];
let modelMoveName = '';
let modelSelectName = '';
let isModelSelectName = false;
let oldOffice = null;
let office = null;

let isLock = ref(true)
let showRackName = ref(false)
let rackName = ref('')
let rackNameTop = ref(null)
let rackNameLeft = ref(null)
onMounted(() => {
  init()
  initModel()
})
function init() {
  viewer = new Viewer('three',false)
  //设置相机位置
  viewer.camera.position.set(2, .4, 0);

  viewer.camera.scale.set(0.2,0.2,0.2);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);

  viewer.initRaycaster();
  pointerLockControls = viewer.initPointerLockControls()
  initControls()
  modelLoader = new ModelLoader(viewer);
  boxHelperWrap = new BoxHelperWrap(viewer);
  // floors = new Floors(viewer);
  // floors.addGrid()
  viewer.addAxis()
  viewer.EventBus.on(Events.dblclick.raycaster, (list) => {
    // console.log(list);
  })
  viewer.EventBus.on(Events.click.raycaster, (list) => {})
  viewer.EventBus.on(Events.mousemove.raycaster, (list) => {
    // console.log(list);
    onMouseMove(list)
  })
}
function lookStart(){
  pointerLockControls.lock();
}
function initControls() {
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = true

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  let prevTime = performance.now();

  pointerLockControls.addEventListener('lock',function (){
    isLock.value = false
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  })

  pointerLockControls.addEventListener('unlock',function (){
    isLock.value = true
    showRackName.value = false
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  })

  const onKeyDown = function (event) {
    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if(canJump){
          let a = gsap.fromTo(pointerLockControls.getObject().position,
              {
                y: 0.3,
              },
              {
                y: 1,
                duration: 0.4,
                onStart(){
                  canJump = false
                },
                onComplete() {
                  a.reverse()
                },
                onReverseComplete(){
                  canJump = true
                }
              }
          )
        }
        break;
    }
  };
  const onKeyUp = function (event) {

    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

      case 'Esc':
      case 'KeyEsc':
        pointerLockControls.unlock()
        break;
    }

  }

  let animateFn = {
    fun: () => {
      const time = performance.now();
      if (pointerLockControls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 5.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;
        pointerLockControls.moveRight(-velocity.x * delta);
        pointerLockControls.moveForward(-velocity.z * delta);
      }
      prevTime = time;
    },
    content: viewer,
  }

  viewer.addAnimate(animateFn)
}
function initModel() {
  modelLoader.loadModelToScene('/models/index3/zuo.glb', baseModel => {

    baseModel.setScale(0.01);
    const model = baseModel.gltf.scene;
    model.visible = false
    office = baseModel;
    office.object.rotation.y = Math.PI;
    office.object.position.set(2, 0, 0);
    // model.position.set(80, 2, 90);
    office.object.children.forEach((item) => {
      item.name = item.name.replace('zuo', '');
      if (item.name === 'ding') {
        item.name = 6;
      }
      item.name--;
    });
    office.object.children.sort((a, b) => a.name - b.name).forEach((v) => {
      v.name = 'zuo' + v.name;
    });
    model.name = '办公楼';
    baseModel.openCastShadow();
    oldOffice = model.clone();

    const list = [];
    model.traverseVisible(item => {
      list.push(item);
    });
    viewer.setRaycasterObjects(list);
  });
  modelLoader.loadModelToScene('/models/index3/plane.glb', baseModel => {
    const model = baseModel.gltf.scene;
    model.scale.set(0.0001 * 3, 0.0001 * 3, 0.0001 * 3)
    model.position.set(0, 0, 0);
    model.name = 'plane';
    baseModel.openCastShadow();
    let material = (baseModel.object.children[0]).material
    const texture = material.map;
    material.emissiveIntensity = 0.9;
    material.emissive = material.color;
    material.emissiveMap = material.map;
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
    const rackList = [];
    model.traverse(item => {
      if (checkIsRack(item)) {
        rackList.push(item);
      }
      if (item.isMesh) {
        let material = item.material
        // material.emissive =  material.color;
        // material.emissiveMap = material.map ;
        // material.emissiveIntensity =  0.9;
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
function checkIsRack(obj) {
  return checkNameIncludes(obj, 'rack');
}
function onMouseMove(intersects = []) {
  if (!intersects.length) {
    showRackName.value= false;
    boxHelperWrap.setVisible(false);
    return;
  }
  const selectedObject = intersects[0].object || {};
  const rack = findParent(selectedObject, checkIsRack);
  if (rack) {
    boxHelperWrap.attach(rack);
    updateRackInfo(rack.name);
  }
}
const updateRackInfo = (name) => {
  if (name) {
    showRackName.value = true
    rackName.value = name
    const event = viewer.mouseEvent;
    rackNameTop.value = event.y + 10;
    rackNameLeft.value = event.x + 10;
  } else {
    showRackName.value = false
    rackName.value = ''
  }
};
</script>
<template>
  <div id="three">
    <div class="model-black" v-if="isLock">
      <button class="btn" @click="lookStart">点击控制方向</button>
    </div>
    <div class="rackName" v-show="showRackName" :style="{top:rackNameTop+'px',left:rackNameLeft+'px'}">{{ rackName }}
    </div>
  </div>
</template>
<style scoped>
#three {
  position: relative;
  width: 100vw;
  height: 100vh;

}
canvas{
  z-index: 1;
}
.model-black{
  position: absolute;
  display: grid;
  place-items: center;
  width: inherit;
  height: inherit;
  background: rgba(0,0,0,.5);
  z-index: 2;

}
.rackName {
  position: absolute;
  z-index: 2;
  color: #fff;
  background: #f60;
}
</style>
