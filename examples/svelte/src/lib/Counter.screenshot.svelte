<script lang="ts">
  import Counter from "./Counter.svelte";

  export let label: string;

  export const args = {
    label: "Hello, World!",
  };

  export function beforeScreenshot(element: HTMLElement) {
    element.querySelector("button")!.click();
  }
</script>

<div>
  <h1>{label}</h1>
  <Counter />
</div>
