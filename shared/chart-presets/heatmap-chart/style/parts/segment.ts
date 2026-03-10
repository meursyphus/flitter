import {
  BoxDecoration,
  Border,
  BoxShadow,
  Container,
  EdgeInsets,
  GestureDetector,
  Opacity,
  StatefulWidget,
  State,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { HeatmapCustom } from "flitter-ui/chart";
import type { HeatmapController } from "flitter-ui/chart";
import type { AgHeatmapChartConfig } from "../config";

export function interpolateColor(
  colorRange: [string, string, string],
  t: number,
): string {
  const clamp = Math.max(0, Math.min(1, t));
  const hex = (c: string) => {
    const h = c.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [r0, g0, b0] = hex(colorRange[0]);
  const [r1, g1, b1] = hex(colorRange[1]);
  const [r2, g2, b2] = hex(colorRange[2]);

  let r: number, g: number, b: number;
  if (clamp <= 0.5) {
    const local = clamp * 2;
    r = r0 + (r1 - r0) * local;
    g = g0 + (g1 - g0) * local;
    b = b0 + (b1 - b0) * local;
  } else {
    const local = (clamp - 0.5) * 2;
    r = r1 + (r2 - r1) * local;
    g = g1 + (g2 - g1) * local;
    b = b1 + (b2 - b1) * local;
  }

  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

class _AgHoverableSegment extends StatefulWidget {
  controller: HeatmapController;
  color: string;
  gap: number;
  value: number;
  xIndex: number;
  yIndex: number;
  xLabel: string;
  yLabel: string;

  constructor(props: {
    controller: HeatmapController;
    color: string;
    gap: number;
    value: number;
    xIndex: number;
    yIndex: number;
    xLabel: string;
    yLabel: string;
  }) {
    super();
    this.controller = props.controller;
    this.color = props.color;
    this.gap = props.gap;
    this.value = props.value;
    this.xIndex = props.xIndex;
    this.yIndex = props.yIndex;
    this.xLabel = props.xLabel;
    this.yLabel = props.yLabel;
  }

  createState() {
    return new _AgHoverableSegmentState();
  }
}

class _AgHoverableSegmentState extends State<_AgHoverableSegment> {
  #onHoverChange = () => {
    this.setState(() => {});
  };

  override initState(): void {
    this.widget.controller.addHoverListener(this.#onHoverChange);
  }

  override didUpdateWidget(oldWidget: _AgHoverableSegment): void {
    if (oldWidget.controller !== this.widget.controller) {
      oldWidget.controller.removeHoverListener(this.#onHoverChange);
      this.widget.controller.addHoverListener(this.#onHoverChange);
    }
  }

  override dispose(): void {
    this.widget.controller.removeHoverListener(this.#onHoverChange);
  }

  override build(): Widget {
    const { controller, color, gap, xIndex, yIndex, value, xLabel, yLabel } =
      this.widget;
    const hovered = controller.hovered;
    const isActive = hovered?.xIndex === xIndex && hovered?.yIndex === yIndex;
    const isDimmed = hovered != null && !isActive;

    const segment = Container({
      margin: EdgeInsets.all(gap),
      decoration: new BoxDecoration({
        color,
        border: isActive
          ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
          : undefined,
        boxShadow: isActive
          ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
          : undefined,
      }),
    });

    return GestureDetector({
      cursor: "default",
      onMouseEnter: () =>
        controller.setHovered({ value, xIndex, yIndex, xLabel, yLabel }),
      child: ZIndex({
        zIndex: isActive ? 1 : 0,
        child: Opacity({
          opacity: isDimmed ? 0.5 : 1,
          child: segment,
        }),
      }),
    });
  }
}

export function agSegment(
  ...[{ value, xIndex, yIndex }, ctx]: Parameters<
    HeatmapCustom<AgHeatmapChartConfig>["segment"]
  >
): Widget {
  const { heatmap } = ctx.config;
  const { min, max } = ctx.scale;
  const fraction = max === min ? 0.5 : (value - min) / (max - min);
  const color = interpolateColor(heatmap.colorRange, fraction);
  const xLabel = ctx.data.xLabels[xIndex] ?? `${xIndex}`;
  const yLabel = ctx.data.yLabels[yIndex] ?? `${yIndex}`;

  return new _AgHoverableSegment({
    controller: ctx as unknown as HeatmapController,
    color,
    gap: heatmap.segment.gap,
    value,
    xIndex,
    yIndex,
    xLabel,
    yLabel,
  });
}
