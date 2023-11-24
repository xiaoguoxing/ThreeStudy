<template>
  <h1 style="position: relative; color: #fff; font-size: 25px">{{ cubeName }}</h1>
  <div class="container" ref="containerRef"></div>
</template>

<script setup>
import * as THREE from "three";
// 轨道
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import * as dat from 'dat.gui'
import { ref, reactive, onMounted } from "vue";
let containerRef = ref(null)
// 三个必备的参数
let scene, camera, renderer, controls, mesh, material, group, texture, model;
let cubeName = ref('')
let modelCopy = ref(null)
onMounted(() => {
  const clock = new THREE.Clock()

  const gui =new dat.GUI()
  const  container = containerRef.value
  // 外层需要获取到dom元素以及浏览器宽高，来对画布设置长宽
  // clientWidth等同于container.value.clientWidth
  const { clientWidth, clientHeight } = container;
  // console.log(clientHeight);

  // 首先需要获取场景，这里公共方法放在init函数中
  const init = () => {
    scene = new THREE.Scene();
    // 给相机设置一个背景
    scene.background = new THREE.Color(0x02045c);
    // 透视投影相机PerspectiveCamera
    // 支持的参数：fov, aspect, near, far
    camera = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.001,
      999999
    );
    // 相机坐标
    camera.position.set(233.74255408437466, 12.416916744908681, 179.7304219401932);
    // 相机观察目标
    // let rotation = new THREE.Vector3(179.080399093471, 0.41626736228011474, 147.38133406932474);
    camera.lookAt(scene.position);
    // console.log('camera:position', camera)
    // 渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    // 渲染多大的地方
    renderer.setSize(clientWidth, clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);
    container.appendChild(renderer.domElement);
    addBox();
    // console.log("查看当前屏幕设备像素比", window.devicePixelRatio);
  };
  init();
  function onModelPositionChange() {
    // 输出模型的当前位置
    console.log("Model Position:", model.position.x, model.position.y, model.position.z);
  }
  function addBox() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    )
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader)
    loader.load('/public/models/waterDrivation.glb',
      function (gltf) {
        // console.log(gltf.scene, 'sceneeeeee.');
        // gltf.scene.name = "正方体";
        model = gltf.scene
        modelCopy.value = gltf.scene
        // model.position.set(-35,50,10)
        // model.position.z = 100
        // model.position.y = 0.210
        // model.position.x = 3.450
        // model.rotation.y = Math.PI / 3
        // model.rotation.x = Math.PI / 30
        // // const nameNode = gltf.scene.getObjectByName("正方体");
        // // console.log(nameNode);
        // // nameNode.material.color.set(0xfff000)
        gltf.scene.traverse(function (child) {
          // console.log(child, 'child..............')

          // 导入纹理图
          // const textureLoader = new THREE.TextureLoader();
          //     const floorColor=textureLoader.load(require('../../../assets/caizhi.jpg'));
          //     const material = new THREE.MeshPhysicalMaterial({
          //       map: floorColor
          //     });
          //     child.material=material
          // const nameNode = gltf.scene.getObjectByName(child.name);
            // console.log(nameNode);
            // nameNode.material.color.set(0xfff000)
          // if (child.name.indexOf('pumpMachine') !== -1) {
          //   const nameNode = gltf.scene.getObjectByName(child.name);
          //   // console.log(nameNode);
          //   nameNode.material.color.set(0xfff000)
          // }
          if (child.isMesh) {
            // child.material.color.set(0xfff000)
            // if (child.name === 'Mesh_140') {
            //   camera.lookAt(child.position)
            // }
          }
        });
        scene.add(gltf.scene);
      },
      function (xhr) {
        // 后台打印查看模型文件加载进度
        console.log("加载完成的百分比" + (xhr.loaded / xhr.total) * 100 + "%");
      },
      function (err) {
        console.log(err, 'errorrr')
        console.error("加载发生错误");
      }
    );
  }
  function onMouseClick(event) {
    let mouse = new THREE.Vector2()
    let raycaster = new THREE.Raycaster()
    const getBoundingClientRect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) * 2 - 1
    mouse.y = ((event.clientY - getBoundingClientRect.top) / container.offsetHeight) * -2 + 1

    // 调用setFromCamera方法，参数是mouse和相机
    raycaster.setFromCamera(mouse, camera)
    // intersectObjects第二个参数必须为true
    const intersects = raycaster.intersectObjects(model.children, true)
    // 这个intersects就是返回的全部对象了
    if (intersects.length > 0) {
      let point = intersects[0].point;
      console.log("点击:", point);
    }
    // let name = ''
    // for (let i = 0; i <= intersects.length; i++) {
    //
    //   if (intersects[i].object.name.indexOf('pumpMachine') !== -1) {
    //     name = intersects[i].object.name
    //     break
    //   } else if (intersects[i].object.name.indexOf('steelTube') !== -1) {
    //     name = intersects[i].object.name
    //     break
    //   } else if (intersects[i].object.name.indexOf('网格') !== -1) {
    //     name = intersects[i].object.parent.name
    //     break
    //   }
    // }
    // cubeName.value = name
  }
  // 相机控件
  const FirstPerson = () => {
    // console.log(modelCopy.value, 'modelCopy')
    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(
217.9813794546228,
-20.219271936294895,
45.16260451741381)
    // controls.target = new THREE.Vector3(
    //   157.0442051390957,
    //   6.624988346225976,
    //   165.19581300175204)
    // controls.lookAt(157.0442051390957,
    //     6.624988346225976,
    //     165.19581300175204)
    controls.movementSpeed = 50;
    // controls.rollSpeed = Math.PI / 60;
    controls.lookSpeed = 0.05;
    controls.verticalMax = Math.PI / 2;
    controls.verticalMin = 0
    // controls.addEventListener("change", () => {
    //
    //   // 浏览器控制台查看controls.target变化，辅助设置lookAt参数
    //   console.log("controls.target", controls.target);
    //   // 浏览器控制台查看相机位置变化
    //   console.log("camera.position", camera.position);
    //
    // });
  };
  // FirstPerson()
  const control = () => {
    // console.log(modelCopy.value, 'modelCopy')
    controls = new OrbitControls(camera, renderer.domElement);
    // controls.position.set(-22.90,-40.56,-15.36)
    // controls.lookAt = new THREE.Vector3(157.0442051390957,
    //   6.624988346225976,
    //   165.19581300175204)

    controls.update();
    // controls.autoRotate  = true;
    controls.panSpeed = .5;
    controls.rotateSpeed  = .5;
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI / 2
    controls.addEventListener("change", () => {

      // 浏览器控制台查看controls.target变化，辅助设置lookAt参数
      // console.log("controls.target", controls.target);
      // // 浏览器控制台查看相机位置变化
      // console.log("camera.position", camera.position);

    });
  };
  control();
  // 光源
  const linght = () => {
    // const light = new THREE.DirectionalLight( 0xffffff, 1);
    const light = new THREE.AmbientLight( 0xffffff, 1 );
    // light.position.set( 0, 1, 0 ); //default; light shining from top
    // light.castShadow = true; // default false
    scene.add( light );
  };
  linght();
  const render = () => {
    renderer.render(scene, camera);

    controls.update(clock.getDelta());
    requestAnimationFrame(render);
  };
  render();
  window.addEventListener("resize", () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(model.position, 'position')
  });
  renderer.domElement.addEventListener('click', onMouseClick, false);
});
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
</style>
