<script lang="ts">
  import Counter from "./Counter.svelte";

  export function beforeScreenshot(element: HTMLElement) {
    element.querySelector("button")!.click();
  }
</script>

<div>
  <h1>Hi, World!</h1>
  <Counter />
</div>
