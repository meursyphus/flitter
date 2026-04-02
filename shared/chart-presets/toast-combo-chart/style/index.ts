import type { ComboChartCustom } from "flitter-ui/chart";
import {
  AnimatedScale,
  Container,
  Stack,
  Alignment,
  Axis,
  CustomPaint,
  Flex,
  Flexible,
  FractionallySizedBox,
  Path,
  Padding,
  Positioned,
  Row,
  Expanded,
  MainAxisAlignment,
  CrossAxisAlignment,
  BoxDecoration,
  Border,
  BoxShadow,
  SizedBox,
  EdgeInsets,
} from "flitter-core";
import type { ComboChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { tooltipContent, toastLegend } from "../../_styles/toast/index";

export { type ComboChartConfig } from "./config";

function getAxisScale(ctx: any, axisId: "primary" | "secondary") {
  return axisId === "secondary" ? ctx.scale?.secondary ?? ctx.scale?.primary : ctx.scale?.primary;
}

const toastCustom: Partial<ComboChartCustom<ComboChartConfig>> = {
  layout: ({ title, legends, plot }) => Cartesian.Layout({ title, legends, plot }),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea: SizedBox.shrink() }),
  dataView: ({ areas, bars, lines }, ctx) =>
    Stack({
      children: [
        ...areas.map((area, index) =>
          Positioned({
            key: `area-${ctx.areas[index]?.legend ?? index}`,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            child: area,
          }),
        ),
        Positioned.fill({
          child: Container({
            width: Infinity,
            height: Infinity,
            child: Flex({
              direction: Axis.horizontal,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: Array.from({ length: ctx.data.labels.length }, (_, labelIndex) =>
                Flexible({
                  flex: 1,
                  child: Row({
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: bars
                      .filter((_, flatIndex) => flatIndex % ctx.data.labels.length === labelIndex)
                      .map((bar, groupIndex) =>
                        Expanded({
                          key: `bar-${labelIndex}-${groupIndex}`,
                          child: bar,
                        }),
                      ),
                  }),
                }),
              ),
            }),
          }),
        }),
        ...lines.map((line, index) =>
          Positioned({
            key: `line-${ctx.lines[index]?.legend ?? index}`,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            child: line,
          }),
        ),
      ],
    }),
  bar: ({ value, label, legend, datasetIndex, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;
    const color =
      ctx.config.colors[
        datasetIndex % ctx.config.colors.length
      ];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label,
        items: { legend, color, value },
        config: ctx.config as any,
      }),
      renderChild: (hovered) =>
        Container({
          width: Infinity,
          height: Infinity,
          alignment: Alignment.bottomCenter,
          child: FractionallySizedBox({
            heightFactor: Math.max(0, Math.min(1, ratio)),
            child: Padding({
              padding: EdgeInsets.symmetric({ horizontal: ctx.config.combo.barGap }),
              child: AnimatedScale({
                duration: ctx.config.animation.duration,
                scale: hovered ? 1.02 : 1,
                alignment: Alignment.center,
                child: Container({
                  width: Infinity,
                  height: Infinity,
                  decoration: new BoxDecoration({
                    color,
                    border:
                      hovered
                        ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                        : undefined,
                    boxShadow: hovered
                      ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
                      : undefined,
                  }),
                }),
              }),
            }),
          }),
        }),
    });
  },
  line: ({ values, legend, datasetIndex, yAxisId, points }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    if (scale == null) return SizedBox.shrink();
    const color =
      ctx.config.colors[
        datasetIndex % ctx.config.colors.length
      ];

    return Stack({
      children: [
        Positioned.fill({
          child: CustomPaint({
            painter: {
              svg: {
                createDefaultSvgEl: (context) => ({
                  line: context.createSvgEl("path"),
                }),
                paint: ({ line }, { width, height }) => {
                  const path = createLinePath({ values, scale, width, height });
                  line.setAttribute("fill", "none");
                  line.setAttribute("stroke", color);
                  line.setAttribute("stroke-width", String(ctx.config.combo.lineWidth));
                  line.setAttribute("stroke-linecap", "round");
                  line.setAttribute("stroke-linejoin", "round");
                  line.setAttribute("d", path.getD());
                },
              },
              canvas: {
                paint: (context, { width, height }) => {
                  const path = createLinePath({ values, scale, width, height });
                  context.canvas.strokeStyle = color;
                  context.canvas.lineWidth = ctx.config.combo.lineWidth;
                  context.canvas.lineCap = "round";
                  context.canvas.lineJoin = "round";
                  context.canvas.stroke(path.toCanvasPath());
                },
              },
            },
          }),
        }),
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: points.map((point, index) => Expanded({ key: `${legend}-${index}`, child: point })),
        }),
      ],
    });
  },
  linePoint: ({ value, label, legend, datasetIndex, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;
    const color =
      ctx.config.colors[
        datasetIndex % ctx.config.colors.length
      ];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label,
        items: { legend, color, value },
        config: ctx.config as any,
      }),
      renderChild: (hovered) =>
        Container({
          width: Infinity,
          height: Infinity,
          alignment: Alignment.bottomCenter,
          child: FractionallySizedBox({
            heightFactor: Math.max(0, Math.min(1, ratio)),
            alignment: Alignment.topCenter,
            child: Container({
              alignment: Alignment.topCenter,
              child: SizedBox({
                width: hovered ? ctx.config.combo.pointSize + 2 : ctx.config.combo.pointSize,
                height: hovered ? ctx.config.combo.pointSize + 2 : ctx.config.combo.pointSize,
                child: AnimatedScale({
                  duration: ctx.config.animation.duration,
                  scale: hovered ? 1.06 : 1,
                  alignment: Alignment.center,
                  child: Container({
                    width: Infinity,
                    height: Infinity,
                    decoration: new BoxDecoration({
                      color,
                      shape: "circle",
                      border:
                        hovered
                          ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                          : undefined,
                      boxShadow: hovered
                        ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
                        : undefined,
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
    });
  },
  area: ({ values, legend, datasetIndex, yAxisId, points }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    if (scale == null) return SizedBox.shrink();
    const color =
      ctx.config.colors[
        datasetIndex % ctx.config.colors.length
      ];

    return Stack({
      children: [
        Positioned.fill({
          child: CustomPaint({
            painter: {
              svg: {
                createDefaultSvgEl: (context) => ({
                  area: context.createSvgEl("path"),
                  line: context.createSvgEl("path"),
                }),
                paint: ({ area, line }, { width, height }) => {
                  const areaPath = createAreaPath({ values, scale, width, height });
                  const linePath = createLinePath({ values, scale, width, height });
                  area.setAttribute("fill", color);
                  area.setAttribute("opacity", String(ctx.config.combo.areaOpacity));
                  area.setAttribute("d", areaPath.getD());
                  line.setAttribute("fill", "none");
                  line.setAttribute("stroke", color);
                  line.setAttribute("stroke-width", String(ctx.config.combo.lineWidth));
                  line.setAttribute("stroke-linecap", "round");
                  line.setAttribute("stroke-linejoin", "round");
                  line.setAttribute("d", linePath.getD());
                },
              },
              canvas: {
                paint: (context, { width, height }) => {
                  const areaPath = createAreaPath({ values, scale, width, height });
                  const linePath = createLinePath({ values, scale, width, height });
                  context.canvas.globalAlpha = ctx.config.combo.areaOpacity;
                  context.canvas.fillStyle = color;
                  context.canvas.fill(areaPath.toCanvasPath());
                  context.canvas.globalAlpha = 1;
                  context.canvas.strokeStyle = color;
                  context.canvas.lineWidth = ctx.config.combo.lineWidth;
                  context.canvas.lineCap = "round";
                  context.canvas.lineJoin = "round";
                  context.canvas.stroke(linePath.toCanvasPath());
                },
              },
            },
          }),
        }),
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: points.map((point, index) => Expanded({ key: `${legend}-${index}`, child: point })),
        }),
      ],
    });
  },
  xAxis: ({ line, labels, tick }) => Cartesian.XAxis({ line, labels, tick }, { type: "label" }),
  yAxis: ({ line, labels, tick }) => Cartesian.YAxis({ line, labels, tick }, { type: "value" }),
  yAxis2: ({ labels, tick }) => Cartesian.YAxis({ line: Container({ width: 0, height: 0 }), labels, tick }, { type: "value" }),
  xAxisLabel: (args) => Cartesian.XAxisLabel(args),
  yAxisLabel: (args) => Cartesian.YAxisLabel(args),
  yAxis2Label: (args) => Cartesian.YAxisLabel(args),
  xAxisTick: () => Cartesian.XAxisTick(undefined),
  yAxisTick: () => Cartesian.YAxisTick(undefined),
  xAxisLine: () => Cartesian.XAxisLine(),
  yAxisLine: () => Cartesian.YAxisLine(),
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.primary.max - ctx.scale.primary.min) / ctx.scale.primary.step : 0,
    }),
  gridXLine: () => Cartesian.GridXLine(),
  gridYLine: () => Cartesian.GridYLine(),
  axisCorner: () => Cartesian.AxisCorner(),
  legend: (args, ctx) =>
    toastLegend(
      args,
      {
        config: {
          ...defaultToastConfig,
          font: ctx.config.font,
          colors: ctx.config.colors,
        } as any,
        isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
      },
      { markerShape: "circle" },
    ),
  title: () => Cartesian.Title(),
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ComboChartConfig>): ComboChartConfig =>
    deepMerge(defaultToastConfig, config),
};

function createLinePath({
  values,
  scale,
  width,
  height,
}: {
  values: number[];
  scale: { min: number; max: number };
  width: number;
  height: number;
}) {
  const path = new Path();
  if (values.length === 0) return path;
  const range = scale.max - scale.min || 1;

  values.forEach((value, index) => {
    const x = values.length > 1 ? (index * width) / (values.length - 1) : width / 2;
    const y = height - (height * (value - scale.min)) / range;
    if (index === 0) path.moveTo({ x, y });
    else path.lineTo({ x, y });
  });

  return path;
}

function createAreaPath({
  values,
  scale,
  width,
  height,
}: {
  values: number[];
  scale: { min: number; max: number };
  width: number;
  height: number;
}) {
  const path = createLinePath({ values, scale, width, height });
  if (values.length === 0) return path;
  const range = scale.max - scale.min || 1;
  const baseline = height - (height * (0 - scale.min)) / range;
  const clampedBaseline = Math.min(height, Math.max(0, baseline));
  const lastX = values.length > 1 ? width : width / 2;
  path.lineTo({ x: lastX, y: clampedBaseline });
  path.lineTo({ x: 0, y: clampedBaseline });
  path.close();
  return path;
}
