# @meursyphus/flitter-vue

Vue integration for the Flitter rendering engine.

## Installation

```bash
npm install @meursyphus/flitter-vue @meursyphus/flitter
```

## Usage

```vue
<template>
  <Widget 
    :widget="myWidget" 
    width="600px" 
    height="400px" 
    renderer="svg"
  />
</template>

<script setup>
import { Widget } from '@meursyphus/flitter-vue'
import { Container, Text, Alignment } from '@meursyphus/flitter'

const myWidget = Container({
  alignment: Alignment.center,
  child: Text('Hello from Flitter in Vue!', {
    style: {
      fontSize: 24,
      fontWeight: 'bold'
    }
  })
})
</script>
```

## Props

- **widget**: The Flitter widget to render (optional, defaults to "Hello World" text)
- **width**: Width of the rendering area (default: "100%")
- **height**: Height of the rendering area (default: "300px")  
- **renderer**: Rendering engine - "svg" or "canvas" (default: "svg")

## Example with Animation

```vue
<template>
  <Widget :widget="animatedWidget" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Widget } from '@meursyphus/flitter-vue'
import { 
  Container, 
  AnimatedContainer,
  AnimationController,
  ColorTween,
  Text,
  Alignment,
  Colors
} from '@meursyphus/flitter'

const controller = new AnimationController({
  duration: 2000
})

const animatedWidget = AnimatedContainer({
  decoration: {
    color: ColorTween({
      begin: Colors.blue,
      end: Colors.red
    }).animate(controller)
  },
  alignment: Alignment.center,
  child: Text('Animated Container', {
    style: { 
      fontSize: 20,
      color: Colors.white 
    }
  })
})

onMounted(() => {
  controller.repeat({ reverse: true })
})

onUnmounted(() => {
  controller.dispose()
})
</script>
```

## Features

- Full Flitter widget support
- Reactive to widget and renderer prop changes
- Automatic cleanup on component unmount
- Support for both SVG and Canvas rendering
- TypeScript support out of the box

## License

MIT