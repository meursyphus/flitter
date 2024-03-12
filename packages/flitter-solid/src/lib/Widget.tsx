import { Component, onMount } from "solid-js"
import {
  Widget as _Widget,
  AppRunner,
  Container,
  Text,
  Alignment,
} from "@meursyphus/flitter"

const Widget: Component<{ widget: _Widget, height?: string, width?: string  }> = ({
  width = "calc(100vw - 40px)",
  height = "calc(100vh - 40px)",
  widget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.center,
    child: Text("Empty space"),
    color: "green",
  }),
}: {
  width?: string
  height?: string
  widget?: _Widget
}) => {
  let containerEl: HTMLDivElement | undefined
  let svgEl: SVGSVGElement | undefined
  onMount(() => {
    if (!containerEl) return
    if (!svgEl) return
    const runner = new AppRunner({
      view: svgEl,
    })
    runner.onMount({ resizeTarget: containerEl })
    runner.runApp(widget)
  })

  return (
    <div ref={containerEl} style={{ width, height }}>
      <svg ref={svgEl} />
    </div>
  )
}

export default Widget
