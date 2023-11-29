<script setup>
import Viewer from '@/modules/Viewer'
import ModelLoader from '@/modules/ModelLoader'
import Floors from "@/modules/Floors";
import BoxHelperWrap from "@/modules/BoxHelperWrap";
import * as THREE from 'three'
import {onMounted} from "vue";
import {checkNameIncludes,findParent} from "@/utils";
import Events from "@/modules/Viewer/Events";
let viewer,modelLoader,floors,boxHelperWrap,pointerLockControls;
let dataCenter,oldDataCenter;
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5'];
let modelMoveName = '';
let modelSelectName = '';
let isModelSelectName = false;
let oldOffice = null;
let office = null;
onMounted(()=>{
  init()
  initModel()
})
function init(){
  viewer = new Viewer('three')
  viewer.initRaycaster();
  pointerLockControls = viewer.pointerLockControls
  modelLoader = new ModelLoader(viewer);
  boxHelperWrap = new BoxHelperWrap(viewer);
  // floors = new Floors(viewer);
  // floors.addGrid()
  viewer.addAxis()
  // viewer.addStats()
  viewer.EventBus.on(Events.dblclick.raycaster,(list) => {
    // console.log(list);
  })
  viewer.EventBus.on(Events.mousemove.raycaster,(list) => {
    // console.log(list);
    onMouseMove(list)
  })
  initControls()
}
function initControls(){
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;
  const velocity = new THREE.Vector3();
  three.addEventListener( 'click', function () {
    pointerLockControls.lock();

  } );

  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        console.log('123');
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
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;

    }

  };

  const onKeyUp = function ( event ) {

    switch ( event.code ) {

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

    }

  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );
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
    material.emissiveIntensity =  0.9;
    material.emissive =  material.color;
    material.emissiveMap = material.map ;
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
      if(item.isMesh){
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
function checkIsRack (obj) {
  return checkNameIncludes(obj, 'rack');
}
function onMouseMove(intersects=[]){
  if (!intersects.length) {
    // popoverRef.value.setShow(false);
    boxHelperWrap.setVisible(false);
    return;
  }
  const selectedObject = intersects[0].object || {};

  let selectedObjectName = '';
  const findClickModel = (object) => {
    if (object.name.includes('rack')) {
      selectedObjectName = object.name;
      boxHelperWrap.attach(object);
      return;
    }
    if (object.parent) {
      findClickModel(object.parent);
    }
  };

  findClickModel(selectedObject);

  /*
    if (rack) {

      boxHelperWrap.attach(rack);
      // updateRackInfo(rack.name);
    }
    modelSelect.forEach((item) => {
    if (item === selectedObject.parent?.name) {
      modelMoveName = item;
      if (modelSelectName === modelMoveName) return;
      office.object.getObjectByName(item).traverse(function (child) {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: true, // 无法被选择，鼠标穿透
            color: 'yellow',
            opacity: 0.3,
          });
        }
      });
    } else {
      if (!isModelSelectName && oldOffice) {
        let oldmodel = oldOffice.getObjectByName(item);
        office.object.getObjectByName(item).traverse(function (child) {
          if (child.isMesh) {
            child.material = oldmodel.getObjectByName(child.name).material;
          }
        });
      }
    }
  });
 */
}
const updateRackInfo = (name) => {
  if (name) {
    popoverRef.value.setShow(true, { name });
    const event = viewer.mouseEvent;
    popoverTop.value = event.y + 10;
    popoverLeft.value = event.x + 10;
  } else {
    popoverRef.value.setShow(false);

  }
};
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
