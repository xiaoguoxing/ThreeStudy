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

let viewer, modelLoader, floors, boxHelperWrap, pointerLockControls;
let dataCenter, oldDataCenter;
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5'];
let modelMoveName = '';
let modelSelectName = '';
let isModelSelectName = false;
let oldOffice = null;
let office = null;

onMounted(() => {
  init()
  initModel()
})

function init() {
  viewer = new Viewer('three')
  viewer.initRaycaster();
  //设置相机位置
  viewer.camera.position.set(0, .4, 2);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);

  // new Floors(viewer)
  initLight()
  modelLoader = new ModelLoader(viewer);
  boxHelperWrap = new BoxHelperWrap(viewer);
  // floors = new Floors(viewer);
  // floors.addGrid()
  viewer.addAxis()
  viewer.EventBus.on(Events.dblclick.raycaster, (list) => {
    // console.log(list);
    onMouseClick(list)
  })
  viewer.EventBus.on(Events.click.raycaster, (list) => {
  })
  viewer.EventBus.on(Events.mousemove.raycaster, (list) => {
    // console.log(list);
    onMouseMove(list)
  })
}
function initModel() {
  modelLoader.loadModelToScene('/models/index3/zuo.glb', baseModel => {
    baseModel.setScale(0.01);
    office = baseModel.object;
    office.visible = true
    office.rotation.y = Math.PI;
    office.position.set(.25, 0, 0);
    // model.position.set(80, 2, 90);
    office.children.forEach((item) => {
      item.name = item.name.replace('zuo', '');
      if (item.name === 'ding') {
        item.name = 6;
      }
      item.name--;
    });
    office.children.sort((a, b) => a.name - b.name).forEach((v) => {
      v.name = 'zuo' + v.name;
    });
    office.name = '办公楼';
    baseModel.openCastShadow();
    oldOffice = office.clone();

    const list = [];
    office.traverseVisible(item => {
      list.push(item);
    });
    viewer.setRaycasterObjects(list);
  });
  modelLoader.loadModelToScene('/models/index3/plane.glb', baseModel => {
    const model = baseModel.object;
    model.scale.set(0.0001 * 3, 0.0001 * 3, 0.0001 * 3)
    model.position.set(0, 0, 0);
    model.name = 'plane';
    model.visible = true
    baseModel.openCastShadow();
    let material = (model.children[0]).material
    const texture = material.map;
    material.emissiveIntensity = 0.9;
    material.emissive = material.color;
    material.emissiveMap = material.map;
    const fnOnj = planeAnimate(texture);
    viewer.addAnimate(fnOnj);
  });
}
function initLight(){
  const light2 = new THREE.PointLight(0xff0000, 1);

  light2.castShadow = true
  light2.shadow.radius = 20
  light2.shadow.mapSize.set(512, 512)

  const sphere = new THREE.Points(
      new THREE.SphereGeometry(10, 30, 30),
      new THREE.PointsMaterial({
        // metalness:0.5,
        // roughness:0,
        color: 0xff0000,
        size: 0.005
      })
  );

  sphere.position.set(1, 0.7, 1)

  sphere.scale.set(0.01, 0.01, 0.01)

  sphere.add(light2)

  viewer.scene.add(sphere);

  const animateFn = {
    fun: () => {
      let time = viewer.clock.getElapsedTime()
      sphere.position.x = Math.sin(time) * 0.5
      sphere.position.z = Math.cos(time) * 0.5
      // sphere.position.y = 2+Math.sin(time * 2)
    },
    content: viewer,
  };

  viewer.addAnimate(animateFn)
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
    if(modelMoveName){
      materialOldChange(modelMoveName)
    }
    return;
  }
  const selectedObject = intersects[0].object || {};
  modelSelect.forEach((item) => {
    if (item === selectedObject.parent?.name) {
      modelMoveName = item;
      if (modelSelectName === modelMoveName) return;
      office.getObjectByName(item).traverse(function (child) {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: true, // 无法被选择，鼠标穿透
            color: 'pink',
            opacity: 0.3,
          });
        }
      });
    } else {
      if (!isModelSelectName && oldOffice) {
        materialOldChange(item)
      }
    }
  });
}
function materialOldChange(lastName){
  let oldModel = oldOffice.getObjectByName(lastName);
  office.getObjectByName(lastName).traverse(function (child) {
    if (child.isMesh) {
      child.material = oldModel.getObjectByName(child.name).material;
    }
  });
}
const onMouseClick = (intersects) => {
  if (!intersects.length) return;
  const selectedObject = intersects[0].object;

  // 点击楼房
  if (selectedObject.name.includes('zuo')) {
    selectOffice(selectedObject.parent);
  }

  // 点击其他区域
  if (!selectedObject.name.includes('zuo')) {
    if (!isModelSelectName && oldOffice) {
      materialOldChange(modelMoveName)
    }
  }
};
const selectOffice = (model) => {
  modelSelectName = model.name;
  let oldModel = oldOffice.getObjectByName(modelSelectName);
  let modelSelectIndex = modelSelect.findIndex(v => v === modelSelectName);
  office.children.forEach((child, index) => {
    if (child.name === modelSelectName) {
      child.children.forEach((Mesh) => {
        Mesh.material = oldModel.getObjectByName(Mesh.name).material;
      });
    } else {
      // Mesh.material = new THREE.MeshPhongMaterial({
      //   color: new THREE.Color('#123ca8'),
      //   transparent: true,
      //   opacity: 0.5,
      //   emissiveMap: Mesh.material.map,
      // });
    }
    if (!model.userData.position && index > modelSelectIndex) {
      gsap.to(child.position, {
        y: !child.userData.position ? child.position.y + 40 : child.position.y,
        duration: 2,
        ease: "power1.inOut",
        onComplete: () => {
          child.userData.position = true;
        },
      });
    }
    if (model.userData.position && index <= modelSelectIndex) {
      if (child.userData.position) {
        gsap.to(child.position, {
          y: oldOffice.getObjectByName(child.name).position.y,
          duration: 2,
          ease: "power1.inOut",
          onComplete: () => {
            child.userData.position = false;
          },
        });
      }
    }
  });
};
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
