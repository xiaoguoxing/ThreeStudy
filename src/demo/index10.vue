<script setup>
import renderer from '@/modules/WebGL/run'
import {onMounted, ref} from "vue";
let three = ref(null)
onMounted(()=>{
  renderer(three.value)
})
</script>

<template>
  <div id="three" ref="three"></div>
</template>

<style scoped>
#three {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
