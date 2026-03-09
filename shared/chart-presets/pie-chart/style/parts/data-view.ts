import {
  AnimatedOpacity,
  AnimatedPositioned,
  ConstraintsTransformBox,
  Curves,
  FractionalTranslation,
  Offset,
  Stack,
  StackFit,
  StatefulWidget,
  State,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { PieChartCustom, PieChartContext } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";
import { DataView } from "../../base/data-view";
import { agTooltipContent } from "../../../_styles/ag/index";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

type PieSlice = Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>[0]["slices"][number];

class _AgPieTooltipOverlay extends StatefulWidget {
  child: Widget;
  args: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>[0];
  context: PieChartContext<AgPieChartConfig>;

  constructor({
    child,
    args,
    context,
  }: {
    child: Widget;
    args: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>[0];
    context: PieChartContext<AgPieChartConfig>;
  }) {
    super();
    this.child = child;
    this.args = args;
    this.context = context;
  }

  createState() {
    return new _AgPieTooltipOverlayState();
  }
}

class _AgPieTooltipOverlayState extends State<_AgPieTooltipOverlay> {
  wasVisible = false;
  lastTooltipData: {
    label: string;
    legend: string;
    color: string;
    value: number;
    pixelX: number;
    pixelY: number;
  } | null = null;

  override build(): Widget {
    const { args, context } = this.widget;
    const { hoveredIndex, config } = context;

    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      value: number;
      pixelX: number;
      pixelY: number;
    } | null = null;

    if (hoveredIndex != null && config.tooltip.enabled && args.slices[hoveredIndex]) {
      const slice: PieSlice = args.slices[hoveredIndex];
      const colorIndex = context.legends.indexOf(slice.name);
      const color = config.colors.fills[
        (colorIndex >= 0 ? colorIndex : hoveredIndex) % config.colors.fills.length
      ];
      const outerRadius = Math.min(context.width, context.height) / 2;
      const innerRadius = outerRadius * config.pie.innerRadiusRatio;
      const anchorRadius = innerRadius + (outerRadius - innerRadius) * 0.82;
      const midAngle = -Math.PI / 2 + slice.startAngle + slice.sweepAngle / 2;
      const angleX = Math.cos(midAngle);
      const angleY = Math.sin(midAngle);
      const pixelX = context.width / 2 + anchorRadius * angleX;
      const pixelY = context.height / 2 + anchorRadius * angleY;

      tooltipData = {
        label: slice.name,
        legend: "Value",
        color,
        value: slice.value,
        pixelX,
        pixelY,
      };
    }

    if (tooltipData != null) {
      this.lastTooltipData = tooltipData;
    }

    const isVisible = tooltipData != null;
    const showData = this.lastTooltipData;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    return Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        this.widget.child,
        showData
          ? AnimatedPositioned({
              duration: positionDuration,
              curve: Curves.easeOut,
              left: showData.pixelX,
              top: showData.pixelY,
              child: AnimatedOpacity({
                duration: FADE_DURATION,
                curve: Curves.easeOut,
                opacity: isVisible ? 1 : 0,
                child: FractionalTranslation({
                  translation: new Offset({ x: -0.5, y: -1.05 }),
                  child: ConstraintsTransformBox({
                    constraintsTransform: ConstraintsTransformBox.unconstrained,
                    child: ZIndex({
                      zIndex: 9999,
                      child: agTooltipContent({
                        label: showData.label,
                        items: {
                          legend: showData.legend,
                          color: showData.color,
                          value: showData.value,
                        },
                        config,
                      }),
                    }),
                  }),
                }),
              }),
            })
          : Stack({ fit: StackFit.passthrough, children: [] }),
      ],
    });
  }
}

export function agDataView(
  ...[args, context]: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  if (!context.config.tooltip.enabled) return child;

  return new _AgPieTooltipOverlay({
    child,
    args,
    context,
  });
}
