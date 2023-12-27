<script setup>
import run from '@/modules/WebGL/run'
import {onMounted, ref} from "vue";

let three = ref(null)
let progress = ref(null)
let text = ref('');
let bar = ref(0);
onMounted(() => {
  run(
      three.value,
      progress.value,
      (percent=0) => {
        text.value = `${percent}%`
        bar.value = percent;
      },
      () => {
        // console.log('123');
      }
  )
})
</script>

<template>
  <div id="three" ref="three"></div>
  <div class="container"></div>
  <div class="progress" ref="progress">
    <div class="text">{{text}}</div>
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
.container{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: transparent;
}
.progress{
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 3;
  .text{
    font-size: 30px;
    font-weight: bold;
  }
  .progress-content{
    width: 200px;
    height: 10px;
    border: 1px solid #025169;
    border-radius: 50px;
    overflow: hidden;
    .item{
      width: inherit;
      height: inherit;
      background: #92B2B5;
      opacity: 0.8;
    }
  }
}
</style>
