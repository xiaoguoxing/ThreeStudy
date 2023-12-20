<script setup>
import Viewer from '@/modules/Viewer'
import ModelLoader from '@/modules/ModelLoader'
import * as THREE from 'three'
import {onMounted, onUnmounted, ref} from "vue";
import gsap from 'gsap'
import Events from "@/modules/Viewer/Events";
import {randBetween, range,mouseWheel} from '@/utils'
import {AmbientLight, Object3D} from "three";

let viewer, modelLoader;
const MODELS = [
  {
    url: 'bong',
    scale: 0.5,
  },
  {
    url: 'cbd',
    scale: 0.7,
  },
  {
    url: 'thc',
    scale: 0.7,
  },
  {
    url: 'molecule',
    scale: 0.7,
  },
  {
    url: 'flask',
    scale: 0.5,
  },
  {
    url: 'leaf',
    scale: 0.3,
  },
];
let scroll = 0
let pageLength = 2

let texture = new THREE.TextureLoader()

onMounted(() => {
  init()
  initModel()
})

onUnmounted(()=>{
  document.removeEventListener('mousemove',onMouseMove)
})

function init() {
  viewer = new Viewer('three', false,false,false)
  initLight()
  viewer.scene.background =  new  THREE.Color('#cbe0e0');
  viewer.scene.fog = new THREE.Fog(0xcae0e0, 30, 35)
  modelLoader = new ModelLoader(viewer)
  viewer.camera.position.set(0, 0, 8);
  //设置相机方向
  viewer.camera.lookAt(0, viewer.camera.position.y, 0);
  // viewer.camera.near = 0.01
  // viewer.camera.far = 15/2
  viewer.initRaycaster();
  // viewer.addAxis()
  document.addEventListener('mousemove',onMouseMove)
  // document.addEventListener('wheel',onMouseWheel)
  mouseWheel(document,(x,y)=>{
    onMouseWheel(y);
  })
}

function initLight(){
  const light1 = new THREE.DirectionalLight(0x4af2d4, 1);
  light1.position.set(-100, -10, -10);
  viewer.scene.add(light1);

  const light2 = new  THREE.DirectionalLight(0xff7e00, 0.5);
  light2.position.set(100, -10, -20);
  viewer.scene.add(light2);

  const light3 = new  THREE.DirectionalLight(0xffffff, 0.8);
  light3.position.set(50, 50, 20);
  viewer.scene.add(light3);

  const ambient = new AmbientLight(0xffffff, 1.8);
  viewer.scene.add(ambient);
}

function initModel() {

  modelLoader.loadModelToScene('/weedensenteret/brain.glb', baseModel => {
    const scene = baseModel.object;
    const brainMesh = scene.children[0];
    const left = brainMesh.getObjectByName('brain_left001');
    const right = brainMesh.getObjectByName('brain_right001');
    left.material = new THREE.MeshLambertMaterial({
      map: texture.load('/weedensenteret/brain-left-texture2.jpg'),
      color: new THREE.Color(0xf7f7f7),
    });
    right.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xf7f7f7),
      map: texture.load('/weedensenteret/brain-left-texture2.jpg'),
    });
    left.position.x = 0.0001;
    brainMesh.scale.set(
        Math.min(window.innerHeight * 0.23, 270),
        Math.min(window.innerHeight * 0.23, 270),
        Math.min(window.innerHeight * 0.23, 270)
    )
    baseModel.openCastShadow();
  })

  modelLoader.loadModelToScene('/weedensenteret/plant2.glb', baseModel => {
    baseModel.openCastShadow();
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
    plant.position.set(0, -12.5, 0);
  })


  const mat = new THREE.MeshPhongMaterial({
    color: 0xf7f7f7,
    //envMap: this.envMap,
    //reflectivity: 0.05,
  });
  let objects = []
  for (const {url,scale} of MODELS) {
    modelLoader.loadModelToScene(`/weedensenteret/${url}.glb`,urlModel=>{
      urlModel.openCastShadow();
      let Scene = urlModel.object
      const leafMesh = Scene.children[0];
      leafMesh.material = mat;
      leafMesh.scale.set(scale,scale, scale);
      const obj = {
        container:Scene,
        vz: randBetween(-0.05, -0.05),
        rx: randBetween(0, 0.01),
        ry: randBetween(0, 0.01),
        rz: randBetween(0, 0.01),
      };
      getRandomPosition(Scene.position,true,true)
      objects.push(obj)

      let clone = leafMesh.clone()
      let cont2 = new Object3D()
      cont2.add(clone)
      const obj2 = {
        container: cont2,
        vz: randBetween(-0.05, -0.05),
        rx: randBetween(0, 0.01),
        ry: randBetween(0, 0.01),
        rz: randBetween(0, 0.01),
      };
      getRandomPosition(cont2.position, false, true);
      objects.push(obj2);
      viewer.scene.add(cont2)
    })
  }

  viewer.addAnimate({
    content:viewer,
    fun(){
      for (let obj of objects) {
        const container = obj.container;
        container.position.z += obj.vz;

        container.rotation.x += obj.rx;
        container.rotation.y += obj.ry;
        container.rotation.z += obj.rz;

        if (container.position.z < -16) container.position.z = viewer.camera.position.z;
      }
    }
  })
}

function onMouseMove(event) {
  let mouse = new THREE.Vector2()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  gsap.to(viewer.scene.rotation,{y:-(mouse.x * 0.2) ,delay:0.2})
  gsap.to(viewer.scene.rotation,{x:-(mouse.y * 0.2),delay:0.2})
}

function getRandomPosition(pos, leftSide, randZ = false) {
  let x;
  let y = randBetween(-8, 8);

  if (leftSide) {
    x = randBetween(
        -window.innerWidth * 0.006,
        -Math.max(window.innerWidth * 0.003, 4)
    );
  } else {
    x = randBetween(
        window.innerWidth * 0.006,
        Math.max(window.innerWidth * 0.002, 4)
    );
  }

  pos.set(x, y, randZ ? randBetween(-10, viewer.camera.position.z) : pos.z);
}

function onMouseWheel(e){
  scroll += e
  scroll = range(scroll,0,(innerHeight*pageLength) - innerHeight)
  let current = Math.round(scroll/innerHeight)
  gsap.to(viewer.camera.position,{y:-(scroll/innerHeight)*10,direction:3})
}

</script>

<template>
  <div id="three"></div>
<!--  <div class="content">
    <div class="page page1">1</div>
    <div class="page page2">2</div>
  </div>-->
</template>

<style scoped>
#three {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
.content{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.page{
  width: 100vw;
  height: 100vh;
}
</style>
