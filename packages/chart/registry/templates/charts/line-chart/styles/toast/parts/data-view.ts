import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  Positioned,
  SizedBox,
  Container,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Alignment,
  BoxDecoration,
  Border,
  BoxShadow,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

// --- Tooltip layout ---

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;
const DOT_SIZE = 10;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computePointTooltipLayout({
  pointX,
  pointY,
  plotWidth,
  plotHeight,
}: {
  pointX: number;
  pointY: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - pointX >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = pointY >= ESTIMATED_TOOLTIP_HEIGHT;

  if (fitsRight) {
    return {
      position: fitsTop ? "bottomRight" : "topRight",
      translation: new Offset({ x: 1, y: 0 }),
      offset: Offset.Constants.zero,
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }
  return {
    position: fitsTop ? "bottomLeft" : "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

// --- Toast dataView with hover dot + tooltip ---

class _ToastDataViewOverlay extends StatefulWidget {
  lines: Widget[];
  ctx: any;

  constructor({ lines, ctx }: { lines: Widget[]; ctx: any }) {
    super();
    this.lines = lines;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastDataViewOverlayState();
  }
}

class _ToastDataViewOverlayState extends State<_ToastDataViewOverlay> {
  override build(): Widget {
    const { lines, ctx } = this.widget;
    const datasets = ctx.data.datasets;
    const hp = ctx.hoveredPoint;
    const config: ToastLineChartConfig = ctx.config;

    const children: Widget[] = lines.map((line: Widget, i: number) =>
      Positioned({
        key: datasets[i]?.legend ?? i,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        child: line,
      }),
    );

    // Show dot + tooltip at hovered point
    if (hp != null && config.tooltip.enabled) {
      const dataset = datasets.find((d: any) => d.legend === hp.legend);
      if (dataset != null && hp.index < dataset.values.length) {
        const legendIdx = ctx.legends.indexOf(hp.legend);
        const color = config.colors[legendIdx % config.colors.length];
        const value = dataset.values[hp.index];
        const label = ctx.data.labels[hp.index] ?? "";

        // Use renderObject size for tooltip layout computation
        const ro = this.element.renderObject;
        const size = ro.size;
        const layout = computePointTooltipLayout({
          pointX: hp.x,
          pointY: hp.y,
          plotWidth: size.width,
          plotHeight: size.height,
        });

        const dot = Container({
          width: DOT_SIZE,
          height: DOT_SIZE,
          decoration: new BoxDecoration({
            color,
            shape: "circle",
            border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
            boxShadow: [
              new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 6 }),
            ],
          }),
        });

        const tooltipWidget = ZIndex({
          zIndex: 9999,
          child: Padding({
            padding: layout.padding,
            child: ctx.custom.tooltip(
              { label, items: [{ legend: hp.legend, color, value }] },
              ctx,
            ),
          }),
        });

        children.push(
          Positioned({
            key: "__dot__",
            left: hp.x - DOT_SIZE / 2,
            top: hp.y - DOT_SIZE / 2,
            child: Stack({
              fit: StackFit.passthrough,
              clipped: false,
              children: [
                dot,
                Positioned.fill({
                  child: FractionalTranslation({
                    translation: layout.offset,
                    child: ConstraintsTransformBox({
                      constraintsTransform: ConstraintsTransformBox.unconstrained,
                      alignment: Alignment[layout.position],
                      child: FractionalTranslation({
                        translation: layout.translation,
                        child: tooltipWidget,
                      }),
                    }),
                  }),
                }),
              ],
            }),
          }),
        );
      }
    }

    return Stack({ clipped: false, children });
  }
}

// --- Toast dataView ---

export function toastDataView(
  ...[args, ctx]: Parameters<LineChartCustom<ToastLineChartConfig>["dataView"]>
) {
  const { lines } = args;
  const { animation, tooltip } = ctx.config;

  const overlay = new _ToastDataViewOverlay({ lines, ctx });

  if (!animation.enabled) return overlay;

  return new AnimatedDataView({
    child: overlay,
    duration: animation.duration,
    isVertical: false,
    baselineRatio: 0,
  });
}
