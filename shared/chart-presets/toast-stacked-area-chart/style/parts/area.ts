import type { LineChartCustom, LineChartScale } from "flitter-ui/chart";
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
import { drawSplineLine } from "../../../_styles/toast/index";
import type { ToastStackedAreaChartConfig } from "../config";

class _AnimatedStackedArea extends StatefulWidget {
  cumulativeValues: number[];
  previousCumulative: number[];
  scale: LineChartScale;
  color: string;
  strokeWidth: number;
  opacity: number;
  spline: boolean;
  duration: number;
  animationEnabled: boolean;

  constructor({
    key,
    cumulativeValues,
    previousCumulative,
    scale,
    color,
    strokeWidth,
    opacity,
    spline,
    duration,
    animationEnabled,
  }: {
    key: string;
    cumulativeValues: number[];
    previousCumulative: number[];
    scale: LineChartScale;
    color: string;
    strokeWidth: number;
    opacity: number;
    spline: boolean;
    duration: number;
    animationEnabled: boolean;
  }) {
    super(key);
    this.cumulativeValues = cumulativeValues;
    this.previousCumulative = previousCumulative;
    this.scale = scale;
    this.color = color;
    this.strokeWidth = strokeWidth;
    this.opacity = opacity;
    this.spline = spline;
    this.duration = duration;
    this.animationEnabled = animationEnabled;
  }

  createState() {
    return new _AnimatedStackedAreaState();
  }
}

class _AnimatedStackedAreaState extends State<_AnimatedStackedArea> {
  controller!: AnimationController;
  tween!: { value: number };
  prevCumulativeValues: number[] | null = null;
  prevPreviousCumulative: number[] | null = null;
  prevScale: LineChartScale | null = null;

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeInOut }),
    );
  }

  override didUpdateWidget(oldWidget: _AnimatedStackedArea) {
    if (!this.widget.animationEnabled) return;

    const cumulativeChanged =
      oldWidget.cumulativeValues.length !== this.widget.cumulativeValues.length ||
      oldWidget.cumulativeValues.some((v, i) => v !== this.widget.cumulativeValues[i]);
    const prevCumChanged =
      oldWidget.previousCumulative.length !== this.widget.previousCumulative.length ||
      oldWidget.previousCumulative.some((v, i) => v !== this.widget.previousCumulative[i]);
    const scaleChanged =
      oldWidget.scale.min !== this.widget.scale.min ||
      oldWidget.scale.max !== this.widget.scale.max;

    if (cumulativeChanged || prevCumChanged || scaleChanged) {
      this.prevCumulativeValues = oldWidget.cumulativeValues;
      this.prevPreviousCumulative = oldWidget.previousCumulative;
      this.prevScale = oldWidget.scale;
      this.controller.reset();
      this.controller.forward();
    }
  }

  override dispose() {
    this.controller.dispose();
  }

  override build(): Widget {
    const { cumulativeValues, previousCumulative, scale, color, strokeWidth, opacity, spline } = this.widget;
    const t = this.prevCumulativeValues != null ? this.tween.value : 1;

    const currentCumulative =
      this.prevCumulativeValues != null
        ? lerpValues(this.prevCumulativeValues, cumulativeValues, t)
        : cumulativeValues;
    const currentPrevCumulative =
      this.prevPreviousCumulative != null
        ? lerpValues(this.prevPreviousCumulative, previousCumulative, t)
        : previousCumulative;
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
            const areaPath = createStackedAreaPath({
              topValues: currentCumulative,
              bottomValues: currentPrevCumulative,
              scale: currentScale,
              width,
              height,
              spline,
            });
            const linePath = createLinePath({
              values: currentCumulative,
              scale: currentScale,
              width,
              height,
              spline,
            });

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
            const areaPath = createStackedAreaPath({
              topValues: currentCumulative,
              bottomValues: currentPrevCumulative,
              scale: currentScale,
              width,
              height,
              spline,
            });
            const linePath = createLinePath({
              values: currentCumulative,
              scale: currentScale,
              width,
              height,
              spline,
            });

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
  ...[{ values, legend, index, isHovered: _isHovered }, ctx]: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["line"]>
) {
  const { scale, config, data } = ctx;
  if (scale == null) return SizedBox.shrink();

  // Compute cumulative values for stacking
  const datasets = data.datasets;
  const numPoints = values.length;
  const cumulativeValues: number[] = new Array(numPoints).fill(0);
  const previousCumulative: number[] = new Array(numPoints).fill(0);
  for (let d = 0; d <= index; d++) {
    for (let p = 0; p < numPoints; p++) {
      if (d < index) previousCumulative[p] += datasets[d].values[p];
      cumulativeValues[p] += datasets[d].values[p];
    }
  }

  const { colors, area: areaConfig, animation } = config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  return new _AnimatedStackedArea({
    key: legend,
    cumulativeValues,
    previousCumulative,
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
  const points = values.map((value, index) => ({
    x: values.length > 1 ? (index * width) / (values.length - 1) : width / 2,
    y: height - (height * (value - scale.min)) / range,
  }));
  if (points.length === 0) return path;
  path.moveTo(points[0]);
  points.slice(1).forEach((point) => path.lineTo(point));
  return path;
}

function createStackedAreaPath({
  topValues,
  bottomValues,
  scale,
  width,
  height,
  spline,
}: {
  topValues: number[];
  bottomValues: number[];
  scale: LineChartScale;
  width: number;
  height: number;
  spline: boolean;
}) {
  const path = new Path();
  const count = topValues.length;
  const range = scale.max - scale.min;

  if (count === 0) return path;

  if (spline) {
    // Draw top line with spline
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values: topValues,
    });

    // Draw bottom line reversed with spline
    const bottomPath = new Path();
    drawSplineLine(bottomPath, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values: bottomValues,
    });

    // Connect top end to bottom end, then trace bottom reversed
    const bottomPoints = bottomValues
      .map((value, index) => ({
        x: count > 1 ? (index * width) / (count - 1) : width / 2,
        y: height - (height * (value - scale.min)) / range,
      }))
      .reverse();

    bottomPoints.forEach((point) => path.lineTo(point));
    path.close();
    return path;
  }

  const topPoints = topValues.map((value, index) => ({
    x: count > 1 ? (index * width) / (count - 1) : width / 2,
    y: height - (height * (value - scale.min)) / range,
  }));

  const bottomPoints = bottomValues
    .map((value, index) => ({
      x: count > 1 ? (index * width) / (count - 1) : width / 2,
      y: height - (height * (value - scale.min)) / range,
    }))
    .reverse();

  path.moveTo(topPoints[0]);
  topPoints.slice(1).forEach((point) => path.lineTo(point));
  bottomPoints.forEach((point) => path.lineTo(point));
  path.close();

  return path;
}
