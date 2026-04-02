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
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";

const DEFAULT_TOOLTIP_GAP = 4;
const DEFAULT_TOOLTIP_WIDTH = 220;
const DEFAULT_TOOLTIP_HEIGHT = 80;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

type TooltipSize = {
  width: number;
  height: number;
};

type PlotSize = {
  width: number;
  height: number;
};

export type ToastTooltipAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TooltipCandidate =
  | "aboveRight"
  | "aboveLeft"
  | "belowRight"
  | "belowLeft"
  | "rightTop"
  | "rightBottom"
  | "leftTop"
  | "leftBottom"
  | "aboveCenter"
  | "belowCenter";

export type ToastRectTooltipMode =
  | {
      variant: "bar";
      direction: "vertical" | "horizontal";
      value: number;
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

type TooltipBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type TooltipResolution = {
  layout: TooltipLayout;
  candidate: TooltipCandidate;
  candidates: {
    candidate: TooltipCandidate;
    bounds: TooltipBounds;
    overflow: number;
  }[];
};

const CANDIDATE_LAYOUTS = {
  aboveRight: {
    position: "topRight" as TooltipPosition,
    translation: new Offset({ x: 1, y: -1 }),
    padding: (gap: number) => EdgeInsets.only({ left: gap, bottom: gap }),
  },
  aboveLeft: {
    position: "topLeft" as TooltipPosition,
    translation: new Offset({ x: -1, y: -1 }),
    padding: (gap: number) => EdgeInsets.only({ right: gap, bottom: gap }),
  },
  belowRight: {
    position: "bottomRight" as TooltipPosition,
    translation: new Offset({ x: 1, y: 1 }),
    padding: (gap: number) => EdgeInsets.only({ left: gap, top: gap }),
  },
  belowLeft: {
    position: "bottomLeft" as TooltipPosition,
    translation: new Offset({ x: -1, y: 1 }),
    padding: (gap: number) => EdgeInsets.only({ right: gap, top: gap }),
  },
  rightTop: {
    position: "topRight" as TooltipPosition,
    translation: new Offset({ x: 1, y: 0 }),
    padding: (gap: number) => EdgeInsets.only({ left: gap }),
  },
  rightBottom: {
    position: "bottomRight" as TooltipPosition,
    translation: new Offset({ x: 1, y: 0 }),
    padding: (gap: number) => EdgeInsets.only({ left: gap }),
  },
  leftTop: {
    position: "topLeft" as TooltipPosition,
    translation: new Offset({ x: -1, y: 0 }),
    padding: (gap: number) => EdgeInsets.only({ right: gap }),
  },
  leftBottom: {
    position: "bottomLeft" as TooltipPosition,
    translation: new Offset({ x: -1, y: 0 }),
    padding: (gap: number) => EdgeInsets.only({ right: gap }),
  },
  aboveCenter: {
    position: "topCenter" as TooltipPosition,
    translation: new Offset({ x: 0, y: -1 }),
    padding: (gap: number) => EdgeInsets.only({ bottom: gap }),
  },
  belowCenter: {
    position: "bottomCenter" as TooltipPosition,
    translation: new Offset({ x: 0, y: 1 }),
    padding: (gap: number) => EdgeInsets.only({ top: gap }),
  },
} satisfies Record<
  TooltipCandidate,
  {
    position: TooltipPosition;
    translation: Offset;
    padding: (gap: number) => EdgeInsets;
  }
>;

function estimateTooltipBounds(
  candidate: TooltipCandidate,
  anchorRect: ToastTooltipAnchorRect,
  tooltipSize: TooltipSize,
  gap: number,
): TooltipBounds {
  const centerX = anchorRect.x + anchorRect.width / 2;
  const centerY = anchorRect.y + anchorRect.height / 2;

  switch (candidate) {
    case "aboveRight":
      return {
        left: anchorRect.x + anchorRect.width + gap,
        top: anchorRect.y - gap - tooltipSize.height,
        right: anchorRect.x + anchorRect.width + gap + tooltipSize.width,
        bottom: anchorRect.y - gap,
      };
    case "aboveLeft":
      return {
        left: anchorRect.x - gap - tooltipSize.width,
        top: anchorRect.y - gap - tooltipSize.height,
        right: anchorRect.x - gap,
        bottom: anchorRect.y - gap,
      };
    case "belowRight":
      return {
        left: anchorRect.x + anchorRect.width + gap,
        top: anchorRect.y + anchorRect.height + gap,
        right: anchorRect.x + anchorRect.width + gap + tooltipSize.width,
        bottom: anchorRect.y + anchorRect.height + gap + tooltipSize.height,
      };
    case "belowLeft":
      return {
        left: anchorRect.x - gap - tooltipSize.width,
        top: anchorRect.y + anchorRect.height + gap,
        right: anchorRect.x - gap,
        bottom: anchorRect.y + anchorRect.height + gap + tooltipSize.height,
      };
    case "rightTop":
      return {
        left: anchorRect.x + anchorRect.width + gap,
        top: anchorRect.y,
        right: anchorRect.x + anchorRect.width + gap + tooltipSize.width,
        bottom: anchorRect.y + tooltipSize.height,
      };
    case "rightBottom":
      return {
        left: anchorRect.x + anchorRect.width + gap,
        top: anchorRect.y + anchorRect.height - tooltipSize.height,
        right: anchorRect.x + anchorRect.width + gap + tooltipSize.width,
        bottom: anchorRect.y + anchorRect.height,
      };
    case "leftTop":
      return {
        left: anchorRect.x - gap - tooltipSize.width,
        top: anchorRect.y,
        right: anchorRect.x - gap,
        bottom: anchorRect.y + tooltipSize.height,
      };
    case "leftBottom":
      return {
        left: anchorRect.x - gap - tooltipSize.width,
        top: anchorRect.y + anchorRect.height - tooltipSize.height,
        right: anchorRect.x - gap,
        bottom: anchorRect.y + anchorRect.height,
      };
    case "aboveCenter":
      return {
        left: centerX - tooltipSize.width / 2,
        top: anchorRect.y - gap - tooltipSize.height,
        right: centerX + tooltipSize.width / 2,
        bottom: anchorRect.y - gap,
      };
    case "belowCenter":
      return {
        left: centerX - tooltipSize.width / 2,
        top: anchorRect.y + anchorRect.height + gap,
        right: centerX + tooltipSize.width / 2,
        bottom: anchorRect.y + anchorRect.height + gap + tooltipSize.height,
      };
  }
}

function computeOverflow(bounds: TooltipBounds, plotSize: PlotSize): number {
  return (
    Math.max(0, -bounds.left) +
    Math.max(0, -bounds.top) +
    Math.max(0, bounds.right - plotSize.width) +
    Math.max(0, bounds.bottom - plotSize.height)
  );
}

function prefersRight(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): boolean {
  const rightSpace = plotSize.width - (anchorRect.x + anchorRect.width);
  const leftSpace = anchorRect.x;
  return rightSpace >= leftSpace;
}

function prefersTop(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): boolean {
  const topSpace = anchorRect.y;
  const bottomSpace = plotSize.height - (anchorRect.y + anchorRect.height);
  return topSpace >= bottomSpace;
}

function getAboveCornerCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["aboveRight", "aboveLeft"]
    : ["aboveLeft", "aboveRight"];
}

function getBelowCornerCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["belowRight", "belowLeft"]
    : ["belowLeft", "belowRight"];
}

function getTopEdgeCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["rightTop", "leftTop"]
    : ["leftTop", "rightTop"];
}

function getBottomEdgeCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["rightBottom", "leftBottom"]
    : ["leftBottom", "rightBottom"];
}

function getRightEdgeCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["rightTop", "rightBottom"]
    : ["rightBottom", "rightTop"];
}

function getLeftEdgeCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["leftTop", "leftBottom"]
    : ["leftBottom", "leftTop"];
}

function getRightDiagonalCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["aboveRight", "belowRight"]
    : ["belowRight", "aboveRight"];
}

function getLeftDiagonalCandidates(
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["aboveLeft", "belowLeft"]
    : ["belowLeft", "aboveLeft"];
}

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

function resolveTooltipLayout(
  mode: ToastRectTooltipMode,
  anchorRect: ToastTooltipAnchorRect,
  plotSize: PlotSize,
  tooltipSize: TooltipSize,
  gap: number,
): TooltipResolution {
  const candidateOrder = getCandidateOrder(mode, anchorRect, plotSize);
  let bestCandidate = candidateOrder[0];
  let bestOverflow = Number.POSITIVE_INFINITY;
  const candidateResults = candidateOrder.map((candidate) => {
    const bounds = estimateTooltipBounds(candidate, anchorRect, tooltipSize, gap);
    return {
      candidate,
      bounds,
      overflow: computeOverflow(bounds, plotSize),
    };
  });

  for (const result of candidateResults) {
    const { candidate, overflow } = result;

    if (overflow === 0) {
      const layout = CANDIDATE_LAYOUTS[candidate];
      return {
        candidate,
        candidates: candidateResults,
        layout: {
          position: layout.position,
          offset: Offset.Constants.zero,
          translation: layout.translation,
          padding: layout.padding(gap),
        },
      };
    }

    if (overflow < bestOverflow) {
      bestCandidate = candidate;
      bestOverflow = overflow;
    }
  }

  const layout = CANDIDATE_LAYOUTS[bestCandidate];
  return {
    candidate: bestCandidate,
    candidates: candidateResults,
    layout: {
      position: layout.position,
      offset: Offset.Constants.zero,
      translation: layout.translation,
      padding: layout.padding(gap),
    },
  };
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
      const resolution = resolveTooltipLayout(
        mode,
        anchorRect,
        plotSize,
        estimatedTooltipSize,
        tooltipGap,
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
