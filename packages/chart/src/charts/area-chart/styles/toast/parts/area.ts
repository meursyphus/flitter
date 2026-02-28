import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import {
  CustomPaint,
  Path,
  SizedBox,
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  type Widget,
} from "flitter-core";
import { drawSplineLine } from "@shared/styles/toast";
import type { ToastAreaChartConfig } from "../config";

class _AnimatedArea extends StatefulWidget {
  values: number[];
  scale: LineChartScale;
  color: string;
  strokeWidth: number;
  opacity: number;
  spline: boolean;
  duration: number;
  animationEnabled: boolean;

  constructor({
    key,
    values,
    scale,
    color,
    strokeWidth,
    opacity,
    spline,
    duration,
    animationEnabled,
  }: {
    key: string;
    values: number[];
    scale: LineChartScale;
    color: string;
    strokeWidth: number;
    opacity: number;
    spline: boolean;
    duration: number;
    animationEnabled: boolean;
  }) {
    super(key);
    this.values = values;
    this.scale = scale;
    this.color = color;
    this.strokeWidth = strokeWidth;
    this.opacity = opacity;
    this.spline = spline;
    this.duration = duration;
    this.animationEnabled = animationEnabled;
  }

  createState() {
    return new _AnimatedAreaState();
  }
}

class _AnimatedAreaState extends State<_AnimatedArea> {
  controller!: AnimationController;
  tween!: { value: number };
  prevValues: number[] | null = null;
  prevScale: LineChartScale | null = null;

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeInOut }),
    );
  }

  override didUpdateWidget(oldWidget: _AnimatedArea) {
    if (!this.widget.animationEnabled) return;

    const valuesChanged =
      oldWidget.values.length !== this.widget.values.length ||
      oldWidget.values.some((v, i) => v !== this.widget.values[i]);
    const scaleChanged =
      oldWidget.scale.min !== this.widget.scale.min ||
      oldWidget.scale.max !== this.widget.scale.max;

    if (valuesChanged || scaleChanged) {
      this.prevValues = oldWidget.values;
      this.prevScale = oldWidget.scale;
      this.controller.reset();
      this.controller.forward();
    }
  }

  override dispose() {
    this.controller.dispose();
  }

  override build(): Widget {
    const { values, scale, color, strokeWidth, opacity, spline } = this.widget;
    const t = this.prevValues != null ? this.tween.value : 1;
    const currentValues = this.prevValues != null ? lerpValues(this.prevValues, values, t) : values;
    const currentScale =
      this.prevScale != null
        ? lerpScale(this.prevScale, scale, t)
        : scale;

    return CustomPaint({
      painter: {
        shouldRepaint: () => true,
        svg: {
          createDefaultSvgEl: (context) => ({
            area: context.createSvgEl("path"),
            line: context.createSvgEl("path"),
          }),
          paint: ({ area, line }, { width, height }) => {
            const linePath = createLinePath({ values: currentValues, scale: currentScale, width, height, spline });
            const areaPath = createAreaPath({ values: currentValues, scale: currentScale, width, height, spline });

            area.setAttribute("fill", color);
            area.setAttribute("opacity", String(opacity));
            area.setAttribute("d", areaPath.getD());

            line.setAttribute("fill", "none");
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", String(strokeWidth));
            line.setAttribute("stroke-linecap", "round");
            line.setAttribute("stroke-linejoin", "round");
            line.setAttribute("d", linePath.getD());
          },
        },
        canvas: {
          paint: (context, { width, height }) => {
            const linePath = createLinePath({ values: currentValues, scale: currentScale, width, height, spline });
            const areaPath = createAreaPath({ values: currentValues, scale: currentScale, width, height, spline });

            context.canvas.globalAlpha = opacity;
            context.canvas.fillStyle = color;
            context.canvas.fill(areaPath.toCanvasPath());
            context.canvas.globalAlpha = 1;

            context.canvas.strokeStyle = color;
            context.canvas.lineWidth = strokeWidth;
            context.canvas.lineCap = "round";
            context.canvas.lineJoin = "round";
            context.canvas.stroke(linePath.toCanvasPath());
          },
        },
      },
    });
  }
}

export function toastArea(
  ...[{ values, legend }, ctx]: Parameters<LineChartCustom<ToastAreaChartConfig>["line"]>
) {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, area: areaConfig, animation } = config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  return new _AnimatedArea({
    key: legend,
    values,
    scale,
    color,
    strokeWidth: areaConfig.strokeWidth,
    opacity: areaConfig.opacity,
    spline: areaConfig.spline,
    duration: animation.duration,
    animationEnabled: animation.enabled,
  });
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpValues(from: number[], to: number[], t: number): number[] {
  const maxLen = Math.max(from.length, to.length);
  const result: number[] = [];
  for (let i = 0; i < maxLen; i++) {
    const a = i < from.length ? from[i] : (from[from.length - 1] ?? 0);
    const b = i < to.length ? to[i] : (to[to.length - 1] ?? 0);
    result.push(lerp(a, b, t));
  }
  return result;
}

function lerpScale(from: LineChartScale, to: LineChartScale, t: number): LineChartScale {
  return {
    min: lerp(from.min, to.min, t),
    max: lerp(from.max, to.max, t),
    step: lerp(from.step, to.step, t),
  };
}

function createLinePath({
  values,
  scale,
  width,
  height,
  spline,
}: {
  values: number[];
  scale: LineChartScale;
  width: number;
  height: number;
  spline: boolean;
}) {
  const path = new Path();

  if (spline) {
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values,
    });
    return path;
  }

  const range = scale.max - scale.min;
  const points = values.map((value, index) => {
    const y = height - (height * (value - scale.min)) / range;
    const x = values.length > 1 ? (index * width) / (values.length - 1) : width / 2;
    return { x, y };
  });
  if (points.length === 0) return path;
  path.moveTo(points[0]);
  points.slice(1).forEach((point) => path.lineTo(point));
  return path;
}

function createAreaPath({
  values,
  scale,
  width,
  height,
  spline,
}: {
  values: number[];
  scale: LineChartScale;
  width: number;
  height: number;
  spline: boolean;
}) {
  const path = new Path();
  const range = scale.max - scale.min;
  const points = values.map((value, index) => {
    const y = height - (height * (value - scale.min)) / range;
    const x = values.length > 1 ? (index * width) / (values.length - 1) : width / 2;
    return { x, y };
  });
  if (points.length === 0) return path;

  if (spline) {
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values,
    });
  } else {
    path.moveTo(points[0]);
    points.slice(1).forEach((point) => path.lineTo(point));
  }

  const baseline = height - (height * (0 - scale.min)) / range;
  const clampedBaseline = Math.min(height, Math.max(0, baseline));
  path.lineTo({ x: points[points.length - 1].x, y: clampedBaseline });
  path.lineTo({ x: points[0].x, y: clampedBaseline });
  path.close();

  return path;
}
