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
  Axis,
  Container,
  Flex,
  Flexible,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom, CandlestickChartContext } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _AgCandlestickTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: CandlestickChartContext<CandlestickChartConfig>;

  constructor({ child, chartContext }: { child: Widget; chartContext: CandlestickChartContext<CandlestickChartConfig> }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _AgCandlestickTooltipOverlayState();
  }
}

class _AgCandlestickTooltipOverlayState extends State<_AgCandlestickTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    items: { legend: string; color: string; value: number }[];
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
    const { hoveredCandlestick } = ctx;

    let tooltipData: {
      label: string;
      items: { legend: string; color: string; value: number }[];
    } | null = null;

    if (hoveredCandlestick != null) {
      const { index, legend } = hoveredCandlestick;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      if (dataset) {
        const point = dataset.data[index];
        const isUp = point.close >= point.open;
        const color = isUp ? config.candlestick.upColor : config.candlestick.downColor;
        const wickColor = config.candlestick.wickColor;
        const label = ctx.data.labels[index] ?? "";
        tooltipData = {
          label,
          items: [
            { legend: `${legend} open`, color, value: point.open },
            { legend: `${legend} high`, color: wickColor, value: point.high },
            { legend: `${legend} low`, color: wickColor, value: point.low },
            { legend: `${legend} close`, color, value: point.close },
          ],
        };
      }
    }

    if (tooltipData != null) {
      this.lastTooltipData = tooltipData;
    }

    const isVisible = tooltipData != null;
    const positionDuration =
      !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
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
                  child: ctx.custom.tooltip(
                    showData,
                    ctx,
                  ),
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

export function agDataView(
  ...[args, context]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["dataView"]>
): Widget {
  const child = Container({
    width: Infinity,
    height: Infinity,
    child: Flex({
      direction: Axis.horizontal,
      children: args.candlestickGroups.map(({ candlesticks }) =>
        Flexible({
          flex: 1,
          child: Flex({
            direction: Axis.horizontal,
            children: candlesticks.map((candlestick) =>
              Flexible({
                flex: 1,
                child: candlestick,
              }),
            ),
          }),
        }),
      ),
    }),
  });

  if (!context.config.tooltip.enabled) return child;
  return new _AgCandlestickTooltipOverlay({ child, chartContext: context });
}
