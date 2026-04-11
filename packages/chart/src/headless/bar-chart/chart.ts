import {
  StatelessWidget,
  StatefulWidget,
  State,
  GlobalKey,
  type Widget,
  type BuildContext,
  SizedBox,
  GestureDetector,
} from "flitter-core";
import {
  createCartesianChart,
  getScaleLabels,
  resolveOverlayRect,
  type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { BarChartProvider } from "./provider";

type HoveredBarRect = {
  index: number;
  legend: string;
  value: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

class BarGroup extends StatelessWidget {
  #values: number[];
  #index: number;

  constructor({ values, index }: { values: number[]; index: number }) {
    super();
    this.#values = values;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { data } = ctx;
    if (ctx.scale == null) return SizedBox.shrink();

    const bars = this.#values.map((value, datasetIndex) => ({
      bar: new Bar({
        key: `${this.#index}:${data.datasets[datasetIndex].legend}`,
        value,
        index: this.#index,
        legend: data.datasets[datasetIndex].legend,
        label: data.labels[this.#index],
      }),
      value,
      datasetIndex,
    }));

    return ctx.custom.barGroup(
      { bars, index: this.#index, label: data.labels[this.#index] },
      ctx,
    );
  }
}

class Bar extends StatefulWidget {
  value: number;
  index: number;
  legend: string;
  label: string;

  constructor({
    key,
    value,
    index,
    legend,
    label,
  }: {
    key: string;
    value: number;
    index: number;
    legend: string;
    label: string;
  }) {
    super(key);
    this.value = value;
    this.index = index;
    this.legend = legend;
    this.label = label;
  }

  createState() {
    return new BarState();
  }
}

class BarState extends State<Bar> {
  anchorKey = new GlobalKey();

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { index, legend, value, label } = this.widget;
    const isHovered = ctx.isBarHovered(index, legend);
    return GestureDetector({
      key: this.anchorKey,
      cursor: "default",
      onMouseEnter: () => ctx.hoverBar(index, legend, this.anchorKey),
      onMouseLeave: () => ctx.unhoverBar(index, legend),
      child: ctx.custom.bar(
        {
          value,
          index,
          legend,
          label,
          isHovered,
        },
        ctx,
      ),
    });
  }
}

const behavior: CartesianScaffoldBehavior<
  ReturnType<typeof BarChartProvider.of>,
  HoveredBarRect
> = {
  of: (context) => BarChartProvider.of(context),
  buildLayout: (ctx, { title, plot, legends }) =>
    ctx.custom.layout({ title, plot, legends }, ctx),
  buildPlot: (ctx, { xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    ctx.custom.plot(
      {
        xAxis,
        yAxis,
        dataView,
        grid,
        axisCorner,
        tooltipArea: tooltipArea ?? SizedBox.shrink(),
      },
      ctx,
    ),
  getLegends: (ctx) =>
    ctx.legends.map((name, index) => ({
      name,
      index,
      onClick: () => ctx.toggleSeries(name),
    })),
  buildLegend: (ctx, { name, index }) =>
    ctx.custom.legend({ name, index, isVisible: ctx.isSeriesVisible(name) }, ctx),
  getXAxisLabels: (ctx) =>
    ctx.direction === "vertical" ? ctx.data.labels : getScaleLabels(ctx.scale),
  getYAxisLabels: (ctx) =>
    ctx.direction === "vertical" ? getScaleLabels(ctx.scale) : ctx.data.labels,
  shouldRenderDataView: (ctx) => ctx.scale != null,
  buildDataView: (ctx) =>
    GestureDetector({
      behavior: "translucent",
      onMouseLeave: () => ctx.unhoverAllBars(),
      child: ctx.custom.dataView(
        {
          barGroups: Array.from(
            { length: ctx.data.labels.length },
            (_, index) =>
              new BarGroup({
                values: ctx.data.datasets.map(({ values }) => values[index]),
                index,
              }),
          ),
        },
        ctx,
      ),
    }),
  tooltip: {
    resolveHovered: (ctx, overlayKey): HoveredBarRect | null => {
      const hoveredBar = ctx.hoveredBar;
      if (hoveredBar == null) return null;

      const dataset = ctx.data.datasets.find((d) => d.legend === hoveredBar.legend);
      const rect = resolveOverlayRect(overlayKey, hoveredBar.anchorKey);
      if (dataset == null || rect == null || hoveredBar.index >= dataset.values.length) {
        return null;
      }

      return {
        index: hoveredBar.index,
        legend: hoveredBar.legend,
        value: dataset.values[hoveredBar.index],
        label: ctx.data.labels[hoveredBar.index] ?? "",
        ...rect,
      };
    },
    buildTooltip: (ctx, hoveredBarRect) => {
      const legendIdx = ctx.legends.indexOf(hoveredBarRect.legend);
      const colors = ctx.config?.colors ?? [];
      const color = colors[legendIdx % colors.length] ?? "#888";
      return ctx.custom.tooltip(
        {
          label: hoveredBarRect.label,
          items: [
            {
              legend: hoveredBarRect.legend,
              color,
              value: hoveredBarRect.value,
            },
          ],
        },
        ctx,
      );
    },
    buildTooltipArea: (ctx, { tooltip, hovered }) =>
      ctx.custom.tooltipArea({ tooltip, hoveredBar: hovered }, ctx),
  },
};

export default class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return createCartesianChart(behavior);
  }
}
