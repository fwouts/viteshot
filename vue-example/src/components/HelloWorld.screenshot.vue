<template>
  <div>
    <HelloWorld msg="Screenshot" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './HelloWorld.vue'

export default defineComponent({
  name: 'Screenshot',
  components: {
    HelloWorld
  },
  beforeScreenshot(element: HTMLElement) {
    element.querySelector('button')!.click()
  }
})
</script>

<style scoped>
div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>