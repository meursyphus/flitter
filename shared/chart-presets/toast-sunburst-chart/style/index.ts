import type { SunburstChartCustom } from "flitter-ui/chart";
import {
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  CustomPaint,
  EdgeInsets,
  Expanded,
  MainAxisAlignment,
  Offset,
  Padding,
  Path,
  Positioned,
  Radius,
  Row,
  SizedBox,
  Stack,
  Text,
  TextStyle,
} from "flitter-core";
import { HoverTooltip, deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastTitle, tooltipContent } from "../../_styles/toast/index";
import type { FlatSegment } from "../types";
import type { SunburstChartConfig } from "./config";
import { defaultToastConfig } from "./config";

export { type SunburstChartConfig } from "./config";

const toastCustom: Partial<SunburstChartCustom<SunburstChartConfig>> = {
  layout: ({ title, sunburst, legend }, ctx) =>
    Container({
      width: Infinity,
      height: Infinity,
      padding: EdgeInsets.all(ctx.config.sunburst.padding),
      child: Column({
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          hasTitle(ctx.config) ? title : SizedBox.shrink(),
          hasTitle(ctx.config) ? SizedBox({ height: 10 }) : SizedBox.shrink(),
          Expanded({ child: sunburst }),
          ctx.config.legend.visible ? SizedBox({ height: 12 }) : SizedBox.shrink(),
          ctx.config.legend.visible ? legend : SizedBox.shrink(),
        ],
      }),
    }),
  title: (args, ctx) => toastTitle(args as undefined, ctx as any),
  legend: ({ items }, ctx) =>
    items.length === 0 || !ctx.config.legend.visible
      ? SizedBox.shrink()
      : Padding({
          padding: EdgeInsets.only({ top: 6 }),
          child: Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: items,
          }),
        }),
  legendItem: ({ label, color }, ctx) =>
    Padding({
      padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
      child: Row({
        children: [
          Container({
            width: 10,
            height: 10,
            decoration: new BoxDecoration({
              color,
              shape: "circle",
            }),
          }),
          SizedBox({ width: 6 }),
          Text(label, {
            style: new TextStyle({
              fontFamily: ctx.config.font.family,
              fontSize: 11,
              color: "#333333",
            }),
          }),
        ],
      }),
    }),
  sunburst: ({ segments }) =>
    Stack({
      children: segments.map((segment) =>
        Positioned.fill({
          child: toastSegment({ segment }),
        }),
      ),
    }),
  segment: ({ segment }, ctx) => toastSegment({ segment }, ctx),
};

function toastSegment(
  { segment }: { segment: FlatSegment },
  ctx?: Parameters<NonNullable<SunburstChartCustom<SunburstChartConfig>["segment"]>>[1],
) {
  if (ctx == null) return SizedBox.shrink();

  const hovered = ctx.hoveredSegment;
  const isHovered =
    hovered != null &&
    hovered.path.join(" / ") === segment.path.join(" / ") &&
    hovered.depth === segment.depth;
  const hasHover = hovered != null;

  return new HoverTooltip({
    position: "topCenter",
    tooltip: tooltipContent({
      label: segment.path.slice(1).join(" / ") || segment.node.label,
      items: {
        legend: segment.node.label,
        color: segment.color,
        value: segment.node.value ?? segment.node.children?.length ?? segment.depth,
      },
      config: ctx.config as any,
    }),
    onMouseEnter: () => ctx.hoverSegment(segment),
    onMouseLeave: () => ctx.unhoverSegment(),
    renderChild: () =>
      CustomPaint({
        painter: {
          hitTest: (position, size) => {
            const metrics = getRingMetrics(size.width, size.height, ctx.segments, ctx.config);
            if (!metrics) return false;
            const { cx, cy, innerRadius, ringWidth } = metrics;
            return isPointInSegment(position, { cx, cy, innerRadius, ringWidth }, segment);
          },
          svg: {
            createDefaultSvgEl: (context) => ({
              path: context.createSvgEl("path"),
            }),
            paint: ({ path }, size) => {
              const metrics = getRingMetrics(size.width, size.height, ctx.segments, ctx.config);
              if (!metrics) return;
              const d = createArcPath(metrics, segment);
              path.setAttribute("d", d);
              path.setAttribute("fill", segment.color);
              path.setAttribute(
                "fill-opacity",
                String(hasHover ? (isHovered ? 1 : ctx.config.sunburst.inactiveOpacity) : 1),
              );
              path.setAttribute("stroke", "white");
              path.setAttribute("stroke-width", String(isHovered ? 4 : 2));
              if (isHovered) {
                path.setAttribute("filter", "drop-shadow(0 0 10px rgba(0,0,0,0.28))");
              } else {
                path.removeAttribute("filter");
              }
            },
          },
          canvas: {
            paint: (context, size) => {
              const metrics = getRingMetrics(size.width, size.height, ctx.segments, ctx.config);
              if (!metrics) return;
              const segmentPath = createArcCanvasPath(metrics, segment);
              const canvas = context.canvas;
              canvas.globalAlpha = hasHover ? (isHovered ? 1 : ctx.config.sunburst.inactiveOpacity) : 1;
              canvas.fillStyle = segment.color;
              canvas.fill(segmentPath);
              canvas.globalAlpha = 1;
              canvas.strokeStyle = "white";
              canvas.lineWidth = isHovered ? 4 : 2;
              if (isHovered) {
                canvas.shadowColor = "rgba(0,0,0,0.28)";
                canvas.shadowBlur = 10;
              }
              canvas.stroke(segmentPath);
              canvas.shadowBlur = 0;
            },
          },
        },
      }),
  });
}

function hasTitle(config: SunburstChartConfig): boolean {
  return config.title.visible && config.title.text.trim().length > 0;
}

function getRingMetrics(
  width: number,
  height: number,
  segments: FlatSegment[],
  config: SunburstChartConfig,
) {
  const maxDepth = segments.reduce((max, entry) => Math.max(max, entry.depth), 0);
  if (maxDepth <= 0 || width <= 20 || height <= 20) return null;

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(cx, cy) - 10;
  if (maxRadius <= 0) return null;

  const innerRadius = maxRadius * config.sunburst.innerRadiusRatio;
  const ringWidth = (maxRadius - innerRadius) / maxDepth;
  if (ringWidth <= 0) return null;

  return { cx, cy, innerRadius, ringWidth };
}

function getSegmentRadii(depth: number, innerRadius: number, ringWidth: number) {
  const r1 = Math.max(innerRadius + (depth - 1) * ringWidth, 0);
  const r2 = Math.max(innerRadius + depth * ringWidth, r1 + 0.001);
  return { r1, r2 };
}

function createArcPath(
  metrics: { cx: number; cy: number; innerRadius: number; ringWidth: number },
  segment: FlatSegment,
): string {
  const { cx, cy, innerRadius, ringWidth } = metrics;
  const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
  const angleDiff = segment.endAngle - segment.startAngle;

  const outerStart = polarToCartesian(cx, cy, r2, segment.startAngle);
  const outerEnd = polarToCartesian(cx, cy, r2, segment.endAngle);
  const innerStart = polarToCartesian(cx, cy, r1, segment.startAngle);
  const innerEnd = polarToCartesian(cx, cy, r1, segment.endAngle);
  const largeArc = angleDiff > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r2} ${r2} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function createArcCanvasPath(
  metrics: { cx: number; cy: number; innerRadius: number; ringWidth: number },
  segment: FlatSegment,
) {
  const { cx, cy, innerRadius, ringWidth } = metrics;
  const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
  const path = new Path();
  path.moveTo(polarToOffset(cx, cy, r2, segment.startAngle));
  path.arcToPoint({
    endPoint: polarToOffset(cx, cy, r2, segment.endAngle),
    radius: Radius.circular(r2),
    rotation: 0,
    largeArc: segment.endAngle - segment.startAngle > Math.PI,
    clockwise: true,
  });
  path.lineTo(polarToOffset(cx, cy, r1, segment.endAngle));
  path.arcToPoint({
    endPoint: polarToOffset(cx, cy, r1, segment.startAngle),
    radius: Radius.circular(r1),
    rotation: 0,
    largeArc: segment.endAngle - segment.startAngle > Math.PI,
    clockwise: false,
  });
  path.close();
  return path.toCanvasPath();
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const a = angle - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(a),
    y: cy + radius * Math.sin(a),
  };
}

function polarToOffset(cx: number, cy: number, radius: number, angle: number) {
  const point = polarToCartesian(cx, cy, radius, angle);
  return new Offset({ x: point.x, y: point.y });
}

function isPointInSegment(
  position: { x: number; y: number },
  metrics: { cx: number; cy: number; innerRadius: number; ringWidth: number },
  segment: FlatSegment,
) {
  const { cx, cy, innerRadius, ringWidth } = metrics;
  const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
  const dx = position.x - cx;
  const dy = position.y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < r1 || distance > r2) return false;

  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += Math.PI * 2;
  return angle >= segment.startAngle && angle <= segment.endAngle;
}

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<SunburstChartConfig>): SunburstChartConfig =>
    deepMerge(defaultToastConfig, config),
};
