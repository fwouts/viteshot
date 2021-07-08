<script lang="ts">
  import Counter from "./Counter.svelte";

  let title: string;

  export function beforeScreenshot(element: HTMLElement) {
    element.querySelector("button")!.click();
  }
</script>

<div>
  <h1>{title}</h1>
  <Counter />
</div>
