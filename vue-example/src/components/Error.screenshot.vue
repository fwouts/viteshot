<template>
  <div>This should not be shown</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Screenshot',
  beforeScreenshot(element: HTMLElement) {
    throw new Error(`An error should be shown`);
  }
})
</script>
