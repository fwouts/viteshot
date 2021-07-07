<script lang="ts">
  export function beforeScreenshot(element: HTMLElement) {
    throw new Error(`An error should be shown`);
  }
</script>

<div>This should not be shown</div>
