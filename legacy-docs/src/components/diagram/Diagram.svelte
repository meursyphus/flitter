<script lang="ts">
  import Widget from "@meursyphus/flitter-svelte";
  import { Diagram } from "shared";
  import { onMount } from "svelte";
  import project from "./fixture/project";
  let container: HTMLElement;
</script>

<div
  bind:this={container}
  class="w-full h-full border-l border-black bg-gray-200"
>
  <Diagram {project} />
</div>

<style>
  :global(svg text) {
    user-select: none;
  }
</style>
