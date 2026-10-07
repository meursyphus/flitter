import {
  StatefulWidget,
  State,
  GlobalKey,
  SizedBox,
  Stack,
  StackFit,
  Positioned,
  ZIndex,
  ConstraintsTransformBox,
  LayoutBuilder,
  type Widget,
} from "flitter-core";
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
  const rightDiagonalCandidates = getRightDiagonalCandidates(
    anchorRect,
    plotSize,
  );
  const leftDiagonalCandidates = getLeftDiagonalCandidates(
    anchorRect,
    plotSize,
  );

  if (mode.variant === "bar") {
    if (mode.direction === "vertical") {
      return mode.value >= 0
        ? [
            ...topEdgeCandidates,
            ...aboveCornerCandidates,
            ...belowCornerCandidates,
          ]
        : [
            ...bottomEdgeCandidates,
            ...belowCornerCandidates,
            ...aboveCornerCandidates,
          ];
    }

    return mode.value >= 0
      ? [
          ...rightEdgeCandidates,
          ...rightDiagonalCandidates,
          ...leftEdgeCandidates,
        ]
      : [
          ...leftEdgeCandidates,
          ...leftDiagonalCandidates,
          ...rightEdgeCandidates,
        ];
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
    return [
      ...topEdgeCandidates,
      ...aboveCornerCandidates,
      ...belowCornerCandidates,
    ];
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
  tooltipKey = new GlobalKey();
  measuredTooltipSize: TooltipSize | null = null;
  measurementScheduled = false;

  private measureTooltip(): void {
    if (this.measurementScheduled) return;
    this.measurementScheduled = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.measurementScheduled = false;
      const element = this.tooltipKey.buildOwner?.findByGlobalKey(
        this.tooltipKey,
      );
      if (element == null) return;
      const size = element.renderObject.size;
      if (
        this.measuredTooltipSize?.width === size.width &&
        this.measuredTooltipSize?.height === size.height
      )
        return;
      this.setState(() => {
        this.measuredTooltipSize = { width: size.width, height: size.height };
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
    if (anchorRect == null || tooltip == null || !enabled)
      return SizedBox.shrink();
    this.measureTooltip();

    return LayoutBuilder({
      builder: (_, constraints) => {
        const plotSize = {
          width: constraints.maxWidth,
          height: constraints.maxHeight,
        };
        const tooltipSize = this.measuredTooltipSize ?? estimatedTooltipSize;
        const candidates = getCandidateOrder(mode, anchorRect, plotSize);
        // Wide horizontal marks may leave no room on either side.
        const resolution = resolveTooltipPlacement(
          anchorRect,
          plotSize,
          tooltipSize,
          tooltipGap,
          [...candidates, "aboveCenter", "belowCenter"],
        );
        const bounds = resolution.candidates.find(
          (entry) => entry.candidate === resolution.candidate,
        )!.bounds;
        const left = Math.max(
          0,
          Math.min(bounds.left, plotSize.width - tooltipSize.width),
        );
        const top = Math.max(
          0,
          Math.min(bounds.top, plotSize.height - tooltipSize.height),
        );
        return Stack({
          fit: StackFit.expand,
          clipped: false,
          children: [
            Positioned({
              left,
              top,
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: SizedBox({ key: this.tooltipKey, child: tooltip }),
                }),
              }),
            }),
          ],
        });
      },
    });
  }
}

export function toastRectTooltipArea(props: ToastRectTooltipAreaProps): Widget {
  return new _ToastRectTooltipArea(props);
}
