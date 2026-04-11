import {
  StatefulWidget,
  State,
  GlobalKey,
  SizedBox,
  Stack,
  StackFit,
  Positioned,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Alignment,
  type Widget,
} from "flitter-ui";
import {
  type PlotSize,
  type TooltipAnchorRect,
  type TooltipCandidate,
  type TooltipSize,
  getAboveCornerCandidates,
  getBelowCornerCandidates,
  getBottomEdgeCandidates,
  getLeftDiagonalCandidates,
  getLeftEdgeCandidates,
  getRightDiagonalCandidates,
  getRightEdgeCandidates,
  getTopEdgeCandidates,
  prefersTop,
  resolveTooltipPlacement,
} from "./tooltip-layout";

const DEFAULT_TOOLTIP_GAP = 4;
const DEFAULT_TOOLTIP_WIDTH = 220;
const DEFAULT_TOOLTIP_HEIGHT = 80;

export type ToastTooltipAnchorRect = TooltipAnchorRect;

export type ToastRectTooltipMode =
  | {
      variant: "bar";
      direction: "vertical" | "horizontal";
      value: number;
    }
  | {
      variant: "heatmap";
    }
  | {
      variant: "boxPlot";
      direction: "vertical" | "horizontal";
      kind: "boxPlot" | "outlier";
    };

type ToastRectTooltipAreaProps = {
  tooltip: Widget | null;
  anchorRect: ToastTooltipAnchorRect | null;
  enabled: boolean;
  mode: ToastRectTooltipMode;
  tooltipGap?: number;
  estimatedTooltipSize?: TooltipSize;
};

function getCandidateOrder(
  mode: ToastRectTooltipMode,
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): TooltipCandidate[] {
  const aboveCornerCandidates = getAboveCornerCandidates(anchorRect, plotSize);
  const belowCornerCandidates = getBelowCornerCandidates(anchorRect, plotSize);
  const topEdgeCandidates = getTopEdgeCandidates(anchorRect, plotSize);
  const bottomEdgeCandidates = getBottomEdgeCandidates(anchorRect, plotSize);
  const rightEdgeCandidates = getRightEdgeCandidates(anchorRect, plotSize);
  const leftEdgeCandidates = getLeftEdgeCandidates(anchorRect, plotSize);
  const rightDiagonalCandidates = getRightDiagonalCandidates(anchorRect, plotSize);
  const leftDiagonalCandidates = getLeftDiagonalCandidates(anchorRect, plotSize);

  if (mode.variant === "bar") {
    if (mode.direction === "vertical") {
      return mode.value >= 0
        ? [...topEdgeCandidates, ...aboveCornerCandidates, ...belowCornerCandidates]
        : [...bottomEdgeCandidates, ...belowCornerCandidates, ...aboveCornerCandidates];
    }

    return mode.value >= 0
      ? [...rightEdgeCandidates, ...rightDiagonalCandidates, ...leftEdgeCandidates]
      : [...leftEdgeCandidates, ...leftDiagonalCandidates, ...rightEdgeCandidates];
  }

  if (mode.variant === "heatmap") {
    return [
      ...rightEdgeCandidates,
      ...leftEdgeCandidates,
      ...rightDiagonalCandidates,
      ...leftDiagonalCandidates,
    ];
  }

  if (mode.kind === "outlier") {
    return prefersTop(anchorRect, plotSize)
      ? ["aboveCenter", "belowCenter"]
      : ["belowCenter", "aboveCenter"];
  }

  if (mode.direction === "vertical") {
    return [...topEdgeCandidates, ...aboveCornerCandidates, ...belowCornerCandidates];
  }

  return [
    ...rightEdgeCandidates,
    ...leftEdgeCandidates,
    ...rightDiagonalCandidates,
    ...leftDiagonalCandidates,
  ];
}

class _ToastRectTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  anchorRect: ToastTooltipAnchorRect | null;
  enabled: boolean;
  mode: ToastRectTooltipMode;
  tooltipGap: number;
  estimatedTooltipSize: TooltipSize;

  constructor({
    tooltip,
    anchorRect,
    enabled,
    mode,
    tooltipGap = DEFAULT_TOOLTIP_GAP,
    estimatedTooltipSize = {
      width: DEFAULT_TOOLTIP_WIDTH,
      height: DEFAULT_TOOLTIP_HEIGHT,
    },
  }: ToastRectTooltipAreaProps) {
    super();
    this.tooltip = tooltip;
    this.anchorRect = anchorRect;
    this.enabled = enabled;
    this.mode = mode;
    this.tooltipGap = tooltipGap;
    this.estimatedTooltipSize = estimatedTooltipSize;
  }

  createState() {
    return new _ToastRectTooltipAreaState();
  }
}

class _ToastRectTooltipAreaState extends State<_ToastRectTooltipArea> {
  areaKey = new GlobalKey();
  measuredPlotSize: PlotSize | null = null;
  scheduledMeasurement = false;

  private schedulePlotSizeMeasurement(): void {
    if (this.scheduledMeasurement) return;
    this.scheduledMeasurement = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.scheduledMeasurement = false;
      if (this.areaKey.buildOwner == null) return;

      const plotRenderObject = this.areaKey.currentContext?.renderObject;
      if (plotRenderObject == null) return;

      const nextSize = {
        width: plotRenderObject.size.width,
        height: plotRenderObject.size.height,
      };

      if (
        this.measuredPlotSize?.width === nextSize.width &&
        this.measuredPlotSize?.height === nextSize.height
      ) {
        return;
      }

      this.setState(() => {
        this.measuredPlotSize = nextSize;
      });
    });
  }

  override build(): Widget {
    const {
      tooltip,
      anchorRect,
      enabled,
      mode,
      tooltipGap,
      estimatedTooltipSize,
    } = this.widget;

    if (anchorRect == null || tooltip == null || !enabled) {
      return SizedBox.shrink();
    }

    let tooltipPositioned: Widget = SizedBox.shrink();
    const plotSize = this.measuredPlotSize;
    if (plotSize == null) {
      this.schedulePlotSizeMeasurement();
    }

    if (plotSize != null) {
      const resolution = resolveTooltipPlacement(
        anchorRect,
        plotSize,
        estimatedTooltipSize,
        tooltipGap,
        getCandidateOrder(mode, anchorRect, plotSize),
      );
      const { layout } = resolution;

      const tooltipWidget = ZIndex({
        zIndex: 9999,
        child: Padding({
          padding: layout.padding,
          child: tooltip,
        }),
      });

      tooltipPositioned = Positioned({
        key: "__tooltip__",
        left: anchorRect.x,
        top: anchorRect.y,
        child: Stack({
          fit: StackFit.passthrough,
          clipped: false,
          children: [
            SizedBox({
              width: anchorRect.width,
              height: anchorRect.height,
            }),
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
      });
    }

    return Stack({
      key: this.areaKey,
      fit: StackFit.expand,
      clipped: false,
      children: [tooltipPositioned],
    });
  }
}

export function toastRectTooltipArea(props: ToastRectTooltipAreaProps): Widget {
  return new _ToastRectTooltipArea(props);
}
