import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  SizedBox,
  Offset,
  Curves,
  ZIndex,
  type Widget,
} from "flitter-core";

type HoveredPoint = {
  index: number;
  legend: string;
} | null;

type LineLikeTooltipContext = {
  config: { tooltip: { enabled: boolean } };
  getPointPosition: (index: number, legend: string) => { x: number; y: number } | null;
};

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

class _AgLineLikeTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredPoint: HoveredPoint;
  ctx: LineLikeTooltipContext;

  constructor({
    tooltip,
    hoveredPoint,
    ctx,
  }: {
    tooltip: Widget | null;
    hoveredPoint: HoveredPoint;
    ctx: LineLikeTooltipContext;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredPoint = hoveredPoint;
    this.ctx = ctx;
  }

  createState() {
    return new _AgLineLikeTooltipAreaState();
  }
}

class _AgLineLikeTooltipAreaState extends State<_AgLineLikeTooltipArea> {
  pointPixelX = 0;
  pointPixelY = 0;
  wasVisible = false;
  lastTooltip: Widget | null = null;

  override build(): Widget {
    const { tooltip, hoveredPoint, ctx } = this.widget;
    const point = tooltip != null && hoveredPoint != null
      ? ctx.getPointPosition(hoveredPoint.index, hoveredPoint.legend)
      : null;

    if (tooltip != null && point != null) {
      this.lastTooltip = tooltip;
      this.pointPixelX = point.x;
      this.pointPixelY = point.y;
    }

    const isVisible = tooltip != null && point != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showTooltip = this.lastTooltip;
    if (showTooltip == null) return SizedBox.shrink();

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.pointPixelX,
          top: this.pointPixelY,
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
                  child: showTooltip,
                }),
              }),
            }),
          }),
        }),
      ],
    });
  }
}

export function agLineLikeTooltipArea(
  {
    tooltip,
    hoveredPoint,
  }: {
    tooltip: Widget | null;
    hoveredPoint: HoveredPoint;
  },
  ctx: LineLikeTooltipContext,
): Widget {
  if (!ctx.config.tooltip.enabled) return SizedBox.shrink();
  return new _AgLineLikeTooltipArea({ tooltip, hoveredPoint, ctx });
}
