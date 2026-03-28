import {
  Alignment,
  Axis,
  Border,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  CustomPaint,
  EdgeInsets,
  Flex,
  Flexible,
  FractionallySizedBox,
  MainAxisSize,
  Opacity,
  Path,
  Padding,
  Positioned,
  SizedBox,
  Stack,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { WaterfallBarType, WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { agLegend, agTitle, agTooltipContent, cartesian } from "../../_styles/ag/index";

export { type WaterfallChartConfig } from "./config";

const TYPE_INDEX: Record<WaterfallBarType, number> = {
  increase: 0,
  decrease: 1,
  total: 2,
  subtotal: 2,
};

const TYPE_LABEL: Record<WaterfallBarType, string> = {
  increase: "Increase",
  decrease: "Decrease",
  total: "Total",
  subtotal: "Subtotal",
};

const agCustom: Partial<WaterfallChartCustom<WaterfallChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.agLayout({ title, legends, plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ bars, connectors }) =>
    Stack({
      children: [
        ...connectors.map((connector) => Positioned.fill({ child: connector })),
        Positioned.fill({
          child: Flex({
            direction: Axis.horizontal,
            children: bars.map((bar) =>
              Flexible({
                flex: 1,
                child: bar,
              }),
            ),
          }),
        }),
      ],
    }),
  bar: ({ value, cumulative, index, label, type }, ctx) => {
    const scale = ctx.scale;
    if (scale == null) return SizedBox.shrink();

    const total = scale.max - scale.min || 1;
    const barBase =
      type === "total"
        ? 0
        : value >= 0
          ? cumulative - value
          : cumulative;
    const barTop = type === "total" ? cumulative : barBase + value;
    const minValue = Math.min(barBase, barTop);
    const maxValue = Math.max(barBase, barTop);
    const heightRatio = (maxValue - minValue) / total;
    const bottomRatio = (minValue - scale.min) / total;
    const outerHeightFactor = Math.max(0, Math.min(1, bottomRatio + heightRatio));
    const innerHeightFactor =
      outerHeightFactor > 0 ? Math.max(0, Math.min(1, heightRatio / outerHeightFactor)) : 0;
    const color = ctx.config.colors.fills[TYPE_INDEX[type]] ?? ctx.config.colors.fills[0];
    const hoveredBar = ctx.hoveredBar;
    const isHovered = ctx.isBarHovered(index);
    const activeOpacity = hoveredBar == null || isHovered ? 1 : 0.35;
    const dlCfg = ctx.config.waterfall.dataLabel;
    const isPositive = value >= 0;
    const formattedValue = (isPositive ? "+" : "") + value.toLocaleString();

    const dataLabelWidget = dlCfg.visible
      ? Padding({
          padding: EdgeInsets.only({ bottom: isPositive ? 2 : 0, top: isPositive ? 0 : 2 }),
          child: Text(formattedValue, {
            style: new TextStyle({
              fontSize: dlCfg.fontSize,
              color: dlCfg.color,
              fontFamily: dlCfg.fontFamily ?? ctx.config.font.family,
            }),
          }),
        })
      : SizedBox.shrink();

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: [
          { legend: TYPE_LABEL[type], color, value },
          { legend: "Cumulative", color: ctx.config.axis.color, value: cumulative },
        ],
        config: ctx.config as any,
      }),
      onMouseEnter: () => ctx.hoverBar(index),
      onMouseLeave: () => ctx.unhoverBar(),
      renderChild: (hovered) =>
        Opacity({
          opacity: activeOpacity,
          child: Container({
            width: Infinity,
            height: Infinity,
            alignment: Alignment.bottomCenter,
            child:
              outerHeightFactor <= 0
                ? SizedBox.shrink()
                : FractionallySizedBox({
                    heightFactor: outerHeightFactor,
                    alignment: Alignment.bottomCenter,
                    child: Column({
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ...(isPositive && dlCfg.visible
                          ? [dataLabelWidget]
                          : []),
                        Flexible({
                          child: FractionallySizedBox({
                            heightFactor: innerHeightFactor,
                            alignment: Alignment.topCenter,
                            child: Padding({
                              padding: EdgeInsets.symmetric({
                                horizontal: Math.max(2, ctx.config.waterfall.barGap / 2),
                              }),
                              child: Container({
                                width: Infinity,
                                height: Infinity,
                                decoration: new BoxDecoration({
                                  color,
                                  border:
                                    hovered
                                      ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                                      : undefined,
                                }),
                              }),
                            }),
                          }),
                        }),
                        ...(!isPositive && dlCfg.visible
                          ? [dataLabelWidget]
                          : []),
                      ],
                    }),
                  }),
          }),
        }),
    });
  },
  connector: ({ fromCumulative, index }, ctx) => {
    const scale = ctx.scale;
    const nextType = ctx.types[index + 1];
    if (scale == null || nextType === "total") return SizedBox.shrink();

    return CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (context) => ({
            connector: context.createSvgEl("path"),
          }),
          paint: ({ connector }, { width, height }) => {
            const segmentWidth = width / Math.max(ctx.data.values.length, 1);
            const x = segmentWidth * (index + 1);
            const halfSpan = Math.min(
              segmentWidth * 0.18,
              Math.max(ctx.config.waterfall.barGap * 2.5, 12),
            );
            const y = valueToY(fromCumulative, scale.min, scale.max, height);
            const path = createConnectorPath({ x, y, halfSpan });

            connector.setAttribute("d", path.getD());
            connector.setAttribute("fill", "none");
            connector.setAttribute("stroke", ctx.config.grid.color);
            connector.setAttribute("stroke-width", "1.5");
            connector.setAttribute("stroke-dasharray", "3 3");
            connector.setAttribute("stroke-linecap", "round");
          },
        },
        canvas: {
          paint: (context, { width, height }) => {
            const segmentWidth = width / Math.max(ctx.data.values.length, 1);
            const x = segmentWidth * (index + 1);
            const halfSpan = Math.min(
              segmentWidth * 0.18,
              Math.max(ctx.config.waterfall.barGap * 2.5, 12),
            );
            const y = valueToY(fromCumulative, scale.min, scale.max, height);
            const path = createConnectorPath({ x, y, halfSpan });
            const canvas = context.canvas;

            canvas.strokeStyle = ctx.config.grid.color;
            canvas.lineWidth = 1.5;
            canvas.setLineDash([3, 3]);
            canvas.lineCap = "round";
            canvas.stroke(path.toCanvasPath());
            canvas.setLineDash([]);
          },
        },
      },
    });
  },
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  legend: ({ name, index }, ctx) =>
    agLegend(
      { name, index },
      {
        config: ctx.config as any,
        isSeriesVisible: () => true,
        toggleSeries: () => {},
      },
    ),
  title: agTitle as any,
  dataLabel: () => SizedBox.shrink(),
};

function valueToY(value: number, min: number, max: number, height: number): number {
  const ratio = max === min ? 0 : (value - min) / (max - min);
  return height - ratio * height;
}

function createConnectorPath({
  x,
  y,
  halfSpan,
}: {
  x: number;
  y: number;
  halfSpan: number;
}): Path {
  const path = new Path();
  path.moveTo({ x: x - halfSpan, y });
  path.lineTo({ x: x + halfSpan, y });
  return path;
}

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<WaterfallChartConfig>): WaterfallChartConfig =>
    deepMerge(defaultAgConfig, config),
};
