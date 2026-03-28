import {
  Alignment,
  AnimatedOpacity,
  AnimatedPositioned,
  Axis,
  BoxDecoration,
  ConstraintsTransformBox,
  Container,
  Curves,
  Flex,
  Flexible,
  FractionallySizedBox,
  FractionalTranslation,
  GestureDetector,
  Offset,
  Opacity,
  Positioned,
  SizedBox,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { HistogramChartCustom, HistogramChartContext } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { agTitle, agTooltipContent, cartesian } from "@styles/ag";

export { type HistogramChartConfig } from "./config";

// ── Tooltip overlay (mouse-following, AG style) ──────────────────────
const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _HistogramTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: HistogramChartContext<HistogramChartConfig>;

  constructor({
    child,
    chartContext,
  }: {
    child: Widget;
    chartContext: HistogramChartContext<HistogramChartConfig>;
  }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _HistogramTooltipOverlayState();
  }
}

class _HistogramTooltipOverlayState extends State<_HistogramTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    color: string;
    value: number;
  } | null = null;

  private getLocalPosition(e: MouseEvent): { x: number; y: number } {
    const ro = this.element.renderObject;
    const view = ro.renderOwner.renderContext.view;
    const rect = view.getBoundingClientRect();
    const flitterGlobalX = e.clientX - rect.left;
    const flitterGlobalY = e.clientY - rect.top;
    const overlayGlobal = ro.localToGlobal();
    return {
      x: flitterGlobalX - overlayGlobal.x,
      y: flitterGlobalY - overlayGlobal.y,
    };
  }

  override build(): Widget {
    const ctx = this.widget.chartContext;
    const config = ctx.config;
    const { hoveredBin } = ctx;
    const color = config.colors.fills[0];

    let tooltipData: { label: string; color: string; value: number } | null = null;

    if (hoveredBin != null) {
      const bin = ctx.bins[hoveredBin];
      if (bin) {
        tooltipData = {
          label: `${bin.min.toFixed(1)} - ${bin.max.toFixed(1)}`,
          color,
          value: bin.count,
        };
      }
    }

    if (tooltipData != null) {
      this.lastTooltipData = tooltipData;
    }

    const isVisible = tooltipData != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showData = this.lastTooltipData;

    const children: Widget[] = [
      this.widget.child,
      Positioned.fill({
        child: GestureDetector({
          behavior: "translucent",
          cursor: "default",
          onMouseMove: (e: MouseEvent) => {
            const local = this.getLocalPosition(e);
            const dx = local.x - this.mouseX;
            const dy = local.y - this.mouseY;
            if (dx * dx + dy * dy < MOUSE_THRESHOLD * MOUSE_THRESHOLD) return;
            this.setState(() => {
              this.mouseX = local.x;
              this.mouseY = local.y;
            });
          },
          onMouseLeave: () => {
            ctx.unhoverBin();
          },
          child: SizedBox.expand(),
        }),
      }),
    ];

    if (showData != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.mouseX,
          top: this.mouseY - TOOLTIP_OFFSET,
          child: AnimatedOpacity({
            duration: FADE_DURATION,
            opacity: isVisible ? 1 : 0,
            curve: Curves.easeOut,
            child: FractionalTranslation({
              translation: new Offset({ x: -0.5, y: -1 }),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: agTooltipContent({
                    label: showData.label,
                    items: { legend: "Count", color: showData.color, value: showData.value },
                    config: config as any,
                  }),
                }),
              }),
            }),
          }),
        }),
      );
    }

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children,
    });
  }
}

// ── Custom slots ─────────────────────────────────────────────────────

const agCustom: Partial<HistogramChartCustom<HistogramChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.agLayout({ title, legends: [], plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ bars }, ctx) => {
    const child = Container({
      width: Infinity,
      height: Infinity,
      child: Flex({
        direction: Axis.horizontal,
        children: bars.map((bar) =>
          Flexible({
            flex: 1,
            child: bar,
          }),
        ),
      }),
    });

    if (!ctx.config.tooltip.enabled) return child;
    return new _HistogramTooltipOverlay({ child, chartContext: ctx });
  },
  bar: ({ binMin, binMax, count, index }, ctx) => {
    const scale = ctx.scale;
    const ratio =
      scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
    const color = ctx.config.colors.fills[0];
    const { hoveredBin } = ctx;

    let opacity = 1;
    if (hoveredBin != null) {
      opacity = hoveredBin === index ? 1 : 0.35;
    }

    const barWidget = Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.bottomCenter,
      child: FractionallySizedBox({
        heightFactor: Math.max(0, Math.min(1, ratio)),
        child: Container({
          width: Infinity,
          height: Infinity,
          decoration: new BoxDecoration({ color }),
        }),
      }),
    });

    return GestureDetector({
      cursor: "default",
      onMouseEnter: () => ctx.hoverBin(index),
      child: opacity < 1 ? Opacity({ opacity, child: barWidget }) : barWidget,
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
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  title: agTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<HistogramChartConfig>): HistogramChartConfig =>
    deepMerge(defaultAgConfig, config),
};
