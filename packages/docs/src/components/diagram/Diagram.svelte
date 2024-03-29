<script lang="ts">
  import Widget from "@meursyphus/flitter-svelte";
  import Diagram from "./widget/Diagram";
  import { onMount } from "svelte";
  import { project } from "./fixture";
  let container: HTMLElement;
</script>

<div
  bind:this={container}
  class="w-full h-full border-l border-black bg-gray-200"
>
  <Widget
    widget={Diagram({ project: project, subscribe: () => () => {} })}
    width="100%"
    height="100%"
  />
</div>

<style>
  :global(svg text) {
    user-select: none;
  }
</style>
