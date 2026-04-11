import {
  EdgeInsets,
  Offset,
  type TooltipPosition,
} from "flitter-ui";

export type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

export type TooltipSize = {
  width: number;
  height: number;
};

export type PlotSize = {
  width: number;
  height: number;
};

export type TooltipAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TooltipCandidate =
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

export type TooltipBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type TooltipResolution = {
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
  anchorRect: TooltipAnchorRect,
  tooltipSize: TooltipSize,
  gap: number,
): TooltipBounds {
  const centerX = anchorRect.x + anchorRect.width / 2;

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

export function prefersRight(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): boolean {
  const rightSpace = plotSize.width - (anchorRect.x + anchorRect.width);
  const leftSpace = anchorRect.x;
  return rightSpace >= leftSpace;
}

export function prefersTop(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): boolean {
  const topSpace = anchorRect.y;
  const bottomSpace = plotSize.height - (anchorRect.y + anchorRect.height);
  return topSpace >= bottomSpace;
}

export function getAboveCornerCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["aboveRight", "aboveLeft"]
    : ["aboveLeft", "aboveRight"];
}

export function getBelowCornerCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["belowRight", "belowLeft"]
    : ["belowLeft", "belowRight"];
}

export function getTopEdgeCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["rightTop", "leftTop"]
    : ["leftTop", "rightTop"];
}

export function getBottomEdgeCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersRight(anchorRect, plotSize)
    ? ["rightBottom", "leftBottom"]
    : ["leftBottom", "rightBottom"];
}

export function getRightEdgeCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["rightTop", "rightBottom"]
    : ["rightBottom", "rightTop"];
}

export function getLeftEdgeCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["leftTop", "leftBottom"]
    : ["leftBottom", "leftTop"];
}

export function getRightDiagonalCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["aboveRight", "belowRight"]
    : ["belowRight", "aboveRight"];
}

export function getLeftDiagonalCandidates(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
): [TooltipCandidate, TooltipCandidate] {
  return prefersTop(anchorRect, plotSize)
    ? ["aboveLeft", "belowLeft"]
    : ["belowLeft", "aboveLeft"];
}

export function resolveTooltipPlacement(
  anchorRect: TooltipAnchorRect,
  plotSize: PlotSize,
  tooltipSize: TooltipSize,
  gap: number,
  candidateOrder: TooltipCandidate[],
): TooltipResolution {
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
