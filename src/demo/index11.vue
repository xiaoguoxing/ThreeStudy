<script setup>
import run from '@/modules/WebGLV2/run'
import {onMounted, ref} from "vue";

let three = ref(null)
let progress = ref(null)
let text = ref('');
let bar = ref(0);
let threeRun = null
onMounted(() => {
  threeRun = new run(three.value, {
    progressDom: progress.value,
    Progress: (percent = 0) => {
      text.value = `${percent}%`
      bar.value = percent;
    },
    Complete: () => {
    }
  })
})

function xh() {
  threeRun?.destroy()
}
</script>

<template>
  <canvas id="three" ref="three"></canvas>
  <div class="container">
    <button @click="xh">销毁</button>
  </div>
  <div class="progress" ref="progress">
    <div class="text">{{ text }}</div>
    <div class="progress-content">
      <div class="item" :style="{width:text}"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
#three {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: transparent;
}

.progress {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 3;

  .text {
    font-size: 30px;
    font-weight: bold;
  }

  .progress-content {
    width: 200px;
    height: 10px;
    border: 1px solid #025169;
    border-radius: 50px;
    overflow: hidden;

    .item {
      width: inherit;
      height: inherit;
      background: #92B2B5;
      opacity: 0.8;
    }
  }
}
</style>
