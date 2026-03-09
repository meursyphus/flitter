import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  Positioned,
  GestureDetector,
  FractionalTranslation,
  ConstraintsTransformBox,
  Offset,
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
  BoxShadow,
  Radius,
  MainAxisSize,
  CrossAxisAlignment,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom, BoxPlotChartContext, BoxPlotDataPoint } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";
import { DataView } from "../../../box-plot-chart/base/data-view";

class _ToastBoxPlotTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: BoxPlotChartContext<ToastBoxPlotChartConfig>;

  constructor({
    child,
    chartContext,
  }: {
    child: Widget;
    chartContext: BoxPlotChartContext<ToastBoxPlotChartConfig>;
  }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _ToastBoxPlotTooltipOverlayState();
  }
}

class _ToastBoxPlotTooltipOverlayState extends State<_ToastBoxPlotTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
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
      const color = config.colors[legendIdx % config.colors.length];
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
    const showData = isVisible ? tooltipData : null;

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
            if (dx * dx + dy * dy < 9) return;
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
      const { font, tooltip: tooltipConfig } = config;
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
            SizedBox({
              width: 52,
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: font.size - 1,
                  color: tooltipConfig.textColor,
                }),
              }),
            }),
            Text(`${value}`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size - 1,
                fontWeight: "bold",
                color: tooltipConfig.textColor,
              }),
            }),
          ],
        }),
      );

      const tooltipWidget = Container({
        padding: EdgeInsets.all(tooltipConfig.padding),
        decoration: new BoxDecoration({
          color: tooltipConfig.backgroundColor,
          borderRadius: BorderRadius.all(Radius.circular(tooltipConfig.borderRadius)),
          boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.15)", blurRadius: 8 })],
        }),
        child: Column({
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(showData.label, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: "600",
                color: tooltipConfig.textColor,
              }),
            }),
            SizedBox({ height: 4 }),
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Container({
                  width: 10,
                  height: 10,
                  decoration: new BoxDecoration({
                    color: showData.color,
                    borderRadius: BorderRadius.all(Radius.circular(2)),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(showData.legend, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size - 1,
                    color: tooltipConfig.textColor,
                  }),
                }),
              ],
            }),
            SizedBox({ height: 4 }),
            ...statRows,
          ],
        }),
      });

      const ESTIMATED_TOOLTIP_HEIGHT = 160;
      const showBelow = this.mouseY < ESTIMATED_TOOLTIP_HEIGHT;
      const tooltipTop = showBelow ? this.mouseY + 12 : this.mouseY - 12;
      const tooltipTranslationY = showBelow ? 0 : -1;

      children.push(
        Positioned({
          left: this.mouseX,
          top: tooltipTop,
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
      );
    }

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children,
    });
  }
}

export function toastDataView(
  ...[args, context]: Parameters<BoxPlotChartCustom<ToastBoxPlotChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  if (!context.config.tooltip.enabled) return child;
  return new _ToastBoxPlotTooltipOverlay({ child, chartContext: context });
}
