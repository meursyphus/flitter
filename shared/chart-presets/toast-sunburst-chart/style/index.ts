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
  Opacity,
  Padding,
  Row,
  SizedBox,
  Stack,
  Text,
  TextStyle,
} from "flitter-core";
import { HoverTooltip, deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastTitle, tooltipContent } from "../../_styles/toast/index";
import type { FlatSegment } from "../types";
import {
  getRingMetrics as getRingMetricsBase,
  createArcPath,
  createArcCanvasPath,
  isPointInSegment,
  isSegmentHovered,
} from "../../sunburst-chart/base/geometry";
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
  sunburst: ({ segments, dataLabels }) =>
    Stack({
      children: [
        ...segments.map((segment) =>
          Positioned.fill({
            child: toastSegment({ segment }),
          }),
        ),
        ...(dataLabels ?? []).map((label) =>
          Positioned.fill({ child: label }),
        ),
      ],
    }),
  dataLabel: () => SizedBox.shrink(),
  segment: ({ segment }, ctx) => toastSegment({ segment }, ctx),
};

function toastSegment(
  { segment }: { segment: FlatSegment },
  ctx?: Parameters<NonNullable<SunburstChartCustom<SunburstChartConfig>["segment"]>>[1],
) {
  if (ctx == null) return SizedBox.shrink();

  const isHovered = isSegmentHovered(ctx.hoveredSegment, segment);
  const hasHover = ctx.hoveredSegment != null;
  const ratio = ctx.config.sunburst.innerRadiusRatio;

  return new HoverTooltip({
    position: "topCenter",
    behavior: "deferToChild",
    tooltip: tooltipContent({
      label: segment.path.slice(1).join(" / ") || segment.node.label,
      items: {
        legend: segment.node.label,
        color: segment.color,
        value: segment.computedValue,
      },
      config: ctx.config as any,
    }),
    onMouseEnter: () => ctx.hoverSegment(segment),
    onMouseLeave: () => ctx.unhoverSegment(),
    renderChild: () =>
      Opacity({
        opacity: hasHover ? (isHovered ? 1 : ctx.config.sunburst.inactiveOpacity) : 1,
        child: CustomPaint({
          painter: {
            hitTest: (position, size) => {
              const metrics = getRingMetricsBase(size.width, size.height, ctx.segments, ratio);
              if (!metrics) return false;
              return isPointInSegment(position, metrics, segment);
            },
            svg: {
              createDefaultSvgEl: (context) => ({
                path: context.createSvgEl("path"),
              }),
              paint: ({ path }, size) => {
                const metrics = getRingMetricsBase(size.width, size.height, ctx.segments, ratio);
                if (!metrics) return;
                const d = createArcPath(metrics, segment);
                path.setAttribute("d", d);
                path.setAttribute("fill", segment.color);
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
                const metrics = getRingMetricsBase(size.width, size.height, ctx.segments, ratio);
                if (!metrics) return;
                const segmentPath = createArcCanvasPath(metrics, segment);
                const canvas = context.canvas;
                canvas.fillStyle = segment.color;
                canvas.fill(segmentPath);
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
      }),
  });
}

function hasTitle(config: SunburstChartConfig): boolean {
  return config.title.visible && config.title.text.trim().length > 0;
}

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<SunburstChartConfig>): SunburstChartConfig =>
    deepMerge(defaultToastConfig, config),
};
