import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  Positioned,
  GestureDetector,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  Offset,
  Curves,
  SizedBox,
  ZIndex,
  Container,
  Column,
  Row,
  Text,
  TextStyle,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Border,
  BoxShadow,
  Radius,
  MainAxisSize,
  CrossAxisAlignment,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom, BoxPlotChartContext, BoxPlotDataPoint } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { DataView } from "../../base/data-view";
import { tooltipContent } from "../../../_styles/ag/tooltip";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _BoxPlotTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: BoxPlotChartContext<AgBoxPlotChartConfig>;

  constructor({
    child,
    chartContext,
  }: {
    child: Widget;
    chartContext: BoxPlotChartContext<AgBoxPlotChartConfig>;
  }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _BoxPlotTooltipOverlayState();
  }
}

class _BoxPlotTooltipOverlayState extends State<_BoxPlotTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    legend: string;
    color: string;
    dataPoint: BoxPlotDataPoint;
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
    const { hoveredBoxPlot } = ctx;

    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      dataPoint: BoxPlotDataPoint;
    } | null = null;

    if (hoveredBoxPlot != null) {
      const { index, legend } = hoveredBoxPlot;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      const legendIdx = ctx.legends.indexOf(legend);
      const color = config.colors.fills[legendIdx % config.colors.fills.length];
      const dataPoint = dataset?.data[index];
      const label = ctx.data.labels[index] ?? "";
      if (dataPoint) {
        tooltipData = { label, legend, color, dataPoint };
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
            ctx.unhoverBoxPlot();
          },
          child: SizedBox.expand(),
        }),
      }),
    ];

    if (showData != null) {
      const { tooltip, font } = config;
      const dp = showData.dataPoint;

      const statRows = (
        [
          ["min", dp.min],
          ["q1", dp.q1],
          ["median", dp.median],
          ["q3", dp.q3],
          ["max", dp.max],
        ] as [string, number][]
      ).map(([name, value]) =>
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox({ width: 20 }),
            SizedBox({
              width: 52,
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 12,
                  color: tooltip.textColor,
                }),
              }),
            }),
            Text(`${value}`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 12,
                fontWeight: "bold",
                color: tooltip.textColor,
              }),
            }),
          ],
        }),
      );

      const tooltipWidget = Container({
        padding: EdgeInsets.all(tooltip.padding),
        decoration: new BoxDecoration({
          color: tooltip.backgroundColor,
          borderRadius: BorderRadius.all(Radius.circular(tooltip.borderRadius)),
          border: Border.all({ color: tooltip.borderColor, width: 1 }),
          boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.15)", blurRadius: 16 })],
        }),
        child: Column({
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(showData.label, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 13,
                fontWeight: "600",
                color: tooltip.textColor,
              }),
            }),
            SizedBox({ height: 6 }),
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Container({
                  width: 12,
                  height: 12,
                  decoration: new BoxDecoration({
                    color: showData.color,
                    borderRadius: BorderRadius.all(Radius.circular(2)),
                  }),
                }),
                SizedBox({ width: 8 }),
                Text(showData.legend, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: 12,
                    color: tooltip.textColor,
                  }),
                }),
              ],
            }),
            SizedBox({ height: 6 }),
            ...statRows,
          ],
        }),
      });

      // Flip tooltip below cursor when near top of chart
      const ESTIMATED_TOOLTIP_HEIGHT = 170;
      const showBelow = this.mouseY < ESTIMATED_TOOLTIP_HEIGHT;
      const tooltipTop = showBelow
        ? this.mouseY + TOOLTIP_OFFSET
        : this.mouseY - TOOLTIP_OFFSET;
      const tooltipTranslationY = showBelow ? 0 : -1;

      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.mouseX,
          top: tooltipTop,
          child: AnimatedOpacity({
            duration: FADE_DURATION,
            opacity: isVisible ? 1 : 0,
            curve: Curves.easeOut,
            child: FractionalTranslation({
              translation: new Offset({ x: -0.5, y: tooltipTranslationY }),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: tooltipWidget,
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

export function agDataView(
  ...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  if (!context.config.tooltip.enabled) return child;
  return new _BoxPlotTooltipOverlay({ child, chartContext: context });
}
