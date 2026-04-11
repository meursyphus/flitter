import {
  StatefulWidget,
  State,
  GlobalKey,
  SizedBox,
  Stack,
  StackFit,
  Positioned,
  Container,
  ZIndex,
  BoxDecoration,
  Border,
  BoxShadow,
  type Widget,
} from "flitter-ui";
import {
  type PlotSize,
  type TooltipAnchorRect,
  type TooltipSize,
  getLeftDiagonalCandidates,
  getLeftEdgeCandidates,
  getRightDiagonalCandidates,
  getRightEdgeCandidates,
  resolveTooltipPlacement,
} from "./tooltip-layout";

const DEFAULT_TOOLTIP_GAP = 4;
const DEFAULT_TOOLTIP_WIDTH = 220;
const DEFAULT_TOOLTIP_HEIGHT = 80;
const DEFAULT_DOT_SIZE = 10;

export type ToastTooltipAnchorPoint = {
  x: number;
  y: number;
};

type ToastPointTooltipAreaProps = {
  tooltip: Widget | null;
  anchorPoint: ToastTooltipAnchorPoint | null;
  enabled: boolean;
  dotColor: string;
  dotSize?: number;
  tooltipGap?: number;
  estimatedTooltipSize?: TooltipSize;
};

function toAnchorRect(anchorPoint: ToastTooltipAnchorPoint): TooltipAnchorRect {
  return {
    x: anchorPoint.x,
    y: anchorPoint.y,
    width: 0,
    height: 0,
  };
}

class _ToastPointTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  anchorPoint: ToastTooltipAnchorPoint | null;
  enabled: boolean;
  dotColor: string;
  dotSize: number;
  tooltipGap: number;
  estimatedTooltipSize: TooltipSize;

  constructor({
    tooltip,
    anchorPoint,
    enabled,
    dotColor,
    dotSize = DEFAULT_DOT_SIZE,
    tooltipGap = DEFAULT_TOOLTIP_GAP,
    estimatedTooltipSize = {
      width: DEFAULT_TOOLTIP_WIDTH,
      height: DEFAULT_TOOLTIP_HEIGHT,
    },
  }: ToastPointTooltipAreaProps) {
    super();
    this.tooltip = tooltip;
    this.anchorPoint = anchorPoint;
    this.enabled = enabled;
    this.dotColor = dotColor;
    this.dotSize = dotSize;
    this.tooltipGap = tooltipGap;
    this.estimatedTooltipSize = estimatedTooltipSize;
  }

  createState() {
    return new _ToastPointTooltipAreaState();
  }
}

class _ToastPointTooltipAreaState extends State<_ToastPointTooltipArea> {
  areaKey = new GlobalKey();
  tooltipKey = new GlobalKey();
  measuredPlotSize: PlotSize | null = null;
  measuredTooltipSize: TooltipSize | null = null;
  scheduledPlotMeasurement = false;
  scheduledMeasurement = false;

  private schedulePlotMeasurement(): void {
    if (this.scheduledPlotMeasurement) return;
    this.scheduledPlotMeasurement = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.scheduledPlotMeasurement = false;
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

  private scheduleTooltipMeasurement(): void {
    if (this.scheduledMeasurement) return;
    this.scheduledMeasurement = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.scheduledMeasurement = false;
      if (this.tooltipKey.buildOwner == null) return;

      const tooltipRenderObject = this.tooltipKey.currentContext?.renderObject;
      if (tooltipRenderObject == null) return;

      const nextSize = {
        width: tooltipRenderObject.size.width,
        height: tooltipRenderObject.size.height,
      };

      if (
        this.measuredTooltipSize?.width === nextSize.width &&
        this.measuredTooltipSize?.height === nextSize.height
      ) {
        return;
      }

      this.setState(() => {
        this.measuredTooltipSize = nextSize;
      });
    });
  }

  override build(): Widget {
    const {
      tooltip,
      anchorPoint,
      enabled,
      dotColor,
      dotSize,
      tooltipGap,
      estimatedTooltipSize,
    } = this.widget;

    if (anchorPoint == null || tooltip == null || !enabled) {
      return SizedBox.shrink();
    }

    this.scheduleTooltipMeasurement();
    if (this.measuredPlotSize == null) {
      this.schedulePlotMeasurement();
    }

    const plotSize = this.measuredPlotSize;
    const tooltipSize = this.measuredTooltipSize ?? estimatedTooltipSize;
    const anchorRect = toAnchorRect(anchorPoint);
    const fallbackBounds = {
      left: anchorPoint.x + tooltipGap,
      top: Math.max(0, anchorPoint.y - tooltipSize.height / 2),
    };
    let resolvedBounds = fallbackBounds;

    if (plotSize != null) {
      const resolution = resolveTooltipPlacement(
        anchorRect,
        plotSize,
        tooltipSize,
        tooltipGap,
        [
          ...getRightEdgeCandidates(anchorRect, plotSize),
          ...getLeftEdgeCandidates(anchorRect, plotSize),
          ...getRightDiagonalCandidates(anchorRect, plotSize),
          ...getLeftDiagonalCandidates(anchorRect, plotSize),
        ],
      );
      resolvedBounds =
        resolution.candidates.find(
          ({ candidate }) => candidate === resolution.candidate,
        )?.bounds ?? fallbackBounds;
    }

    return Stack({
      key: this.areaKey,
      fit: StackFit.expand,
      clipped: false,
      children: [
        Positioned({
          key: "__dot__",
          left: anchorPoint.x - dotSize / 2,
          top: anchorPoint.y - dotSize / 2,
          child: Container({
            width: dotSize,
            height: dotSize,
            decoration: new BoxDecoration({
              color: dotColor,
              shape: "circle",
              border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
              boxShadow: [
                new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 6 }),
              ],
            }),
          }),
        }),
        Positioned({
          left: resolvedBounds.left,
          top: resolvedBounds.top,
          child: ZIndex({
            zIndex: 9999,
            child: Container({
              key: this.tooltipKey,
              child: tooltip,
            }),
          }),
        }),
      ],
    });
  }
}

export function toastPointTooltipArea(props: ToastPointTooltipAreaProps): Widget {
  return new _ToastPointTooltipArea(props);
}
