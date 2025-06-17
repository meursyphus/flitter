<template>
  <div :style="{ width, height }" ref="containerRef">
    <canvas
      v-if="renderer === 'canvas'"
      :style="{ width: '100%', height: '100%' }"
      ref="canvasRef"
    />
    <svg
      v-else
      :style="{ width: '100%', height: '100%' }"
      ref="svgRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import type { Widget } from '@meursyphus/flitter'
import { Alignment, AppRunner, Container, Text } from '@meursyphus/flitter'

interface Props {
  widget?: Widget
  width?: string
  height?: string
  renderer?: 'canvas' | 'svg'
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '300px',
  renderer: 'svg',
  widget: () => Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.center,
    child: Text('Hello World'),
  })
})

const containerRef = ref<HTMLDivElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let runner: AppRunner | null = null

const viewElement = computed(() => {
  return props.renderer === 'canvas' ? canvasRef.value : svgRef.value
})

function initializeRunner() {
  if (!viewElement.value || !containerRef.value) return

  if (runner) {
    runner.dispose()
  }

  runner = new AppRunner({
    view: viewElement.value,
    window: window,
    document: document,
  })

  runner.runApp(props.widget)
  runner.onMount({
    resizeTarget: containerRef.value,
  })
}

onMounted(() => {
  initializeRunner()
})

onUnmounted(() => {
  if (runner) {
    runner.dispose()
    runner = null
  }
})

watch(() => [props.widget, props.renderer], () => {
  initializeRunner()
})
</script>