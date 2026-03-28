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
  Row,
  Column,
  Text,
  TextStyle,
  EdgeInsets,
  MainAxisSize,
  CrossAxisAlignment,
  BoxDecoration,
  BorderRadius,
  Border,
  BorderSide,
  BoxShadow,
  Radius,
  Transform,
  CustomPaint,
  Size,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;
const ARROW_WIDTH = 16;
const ARROW_HEIGHT = 8;

class _AgBulletTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: BulletChartContext<AgBulletChartConfig>;

  constructor({ child, chartContext }: { child: Widget; chartContext: BulletChartContext<AgBulletChartConfig> }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _AgBulletTooltipOverlayState();
  }
}

class _AgBulletTooltipOverlayState extends State<_AgBulletTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    value: number;
    target: number;
    ranges: number[];
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
    const { hoveredBullet } = ctx;

    let tooltipData: {
      label: string;
      value: number;
      target: number;
      ranges: number[];
    } | null = null;

    if (hoveredBullet != null) {
      const dataset = ctx.data.datasets[hoveredBullet];
      const label = ctx.data.labels[hoveredBullet] ?? "";
      tooltipData = {
        label,
        value: dataset.value,
        target: dataset.target,
        ranges: dataset.ranges,
      };
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
            ctx.unhoverBullet();
          },
          child: SizedBox.expand(),
        }),
      }),
    ];

    if (showData != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.mouseX,
          top: this.mouseY - TOOLTIP_OFFSET,
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
                  child: bulletTooltipContent({
                    label: showData.label,
                    value: showData.value,
                    target: showData.target,
                    config,
                  }),
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

function bulletTooltipContent({
  label,
  value,
  target,
  config,
}: {
  label: string;
  value: number;
  target: number;
  config: AgBulletChartConfig;
}): Widget {
  const { tooltip, font, bullet } = config;

  const rows: Widget[] = [
    Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            color: bullet.valueBarColor,
            borderRadius: BorderRadius.all(Radius.circular(2)),
          }),
        }),
        SizedBox({ width: 8 }),
        Text("Value", {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 12 }),
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
    SizedBox({ height: 4 }),
    Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            color: bullet.targetMarkerColor,
            borderRadius: BorderRadius.all(Radius.circular(2)),
          }),
        }),
        SizedBox({ width: 8 }),
        Text("Target", {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 12 }),
        Text(`${target}`, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            fontWeight: "bold",
            color: tooltip.textColor,
          }),
        }),
      ],
    }),
  ];

  return Column({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      Container({
        padding: EdgeInsets.symmetric({ horizontal: tooltip.padding, vertical: tooltip.padding }),
        decoration: new BoxDecoration({
          color: tooltip.backgroundColor,
          borderRadius: tooltip.borderRadius > 0 ? BorderRadius.all(Radius.circular(tooltip.borderRadius)) : undefined,
          border: Border.all({ color: tooltip.borderColor, width: 1 }),
          boxShadow: [
            new BoxShadow({
              color: "rgba(0,0,0,0.15)",
              blurRadius: 16,
            }),
          ],
        }),
        child: Column({
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 13,
                fontWeight: "600",
                color: tooltip.textColor,
              }),
            }),
            SizedBox({ height: 10 }),
            ...rows,
          ],
        }),
      }),
      Transform.translate({
        offset: new Offset({ x: 0, y: -1 }),
        child: SizedBox({
          width: ARROW_WIDTH,
          height: ARROW_HEIGHT,
          child: CustomPaint({
            size: new Size({ width: ARROW_WIDTH, height: ARROW_HEIGHT }),
            painter: {
              svg: {
                createDefaultSvgEl: (ctx) => ({
                  fill: ctx.createSvgEl("polygon"),
                  borderLeft: ctx.createSvgEl("line"),
                  borderRight: ctx.createSvgEl("line"),
                }),
                paint: ({ fill, borderLeft, borderRight }, size) => {
                  const w = size.width;
                  const h = size.height;
                  const cx = w / 2;

                  fill.setAttribute("points", `0,0 ${w},0 ${cx},${h}`);
                  fill.setAttribute("fill", tooltip.backgroundColor);
                  fill.setAttribute("stroke", "none");

                  borderLeft.setAttribute("x1", "0");
                  borderLeft.setAttribute("y1", "0");
                  borderLeft.setAttribute("x2", `${cx}`);
                  borderLeft.setAttribute("y2", `${h}`);
                  borderLeft.setAttribute("stroke", tooltip.borderColor);
                  borderLeft.setAttribute("stroke-width", "1");

                  borderRight.setAttribute("x1", `${w}`);
                  borderRight.setAttribute("y1", "0");
                  borderRight.setAttribute("x2", `${cx}`);
                  borderRight.setAttribute("y2", `${h}`);
                  borderRight.setAttribute("stroke", tooltip.borderColor);
                  borderRight.setAttribute("stroke-width", "1");
                },
              },
              canvas: {
                paint: (ctx, size) => {
                  const c = ctx.canvas;
                  const w = size.width;
                  const h = size.height;
                  const cx = w / 2;

                  c.beginPath();
                  c.moveTo(0, 0);
                  c.lineTo(w, 0);
                  c.lineTo(cx, h);
                  c.closePath();
                  c.fillStyle = tooltip.backgroundColor;
                  c.fill();

                  c.beginPath();
                  c.moveTo(0, 0);
                  c.lineTo(cx, h);
                  c.lineTo(w, 0);
                  c.strokeStyle = tooltip.borderColor;
                  c.lineWidth = 1;
                  c.stroke();
                },
              },
            },
          }),
        }),
      }),
    ],
  });
}

export function AgBulletTooltipOverlay({
  child,
  context,
}: {
  child: Widget;
  context: BulletChartContext<AgBulletChartConfig>;
}): Widget {
  if (!context.config.tooltip.enabled) return child;
  return new _AgBulletTooltipOverlay({ child, chartContext: context });
}
