import {
  StatelessWidget,
  StatefulWidget,
  State,
  GlobalKey,
  Stack,
  StackFit,
  type Widget,
  type BuildContext,
  LayoutBuilder,
  SizedBox,
  GestureDetector,
} from "flitter-core";
import { BarChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return LayoutBuilder({
      builder: (_ctx: BuildContext, constraints) => {
        ctx.setSize(constraints.maxWidth, constraints.maxHeight);
        return new Layout();
      },
    });
  }
}

export default Chart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.layout(
      {
        title: new Title(),
        plot: new Plot(),
        legends: ctx.legends.map(
          (name, index) => new Legend({ name, index }),
        ),
      },
      ctx,
    );
  }
}

class Legend extends StatelessWidget {
  #name: string;
  #index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.#name = name;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const name = this.#name;
    const isVisible = ctx.isSeriesVisible(name);
    return GestureDetector({
      onClick: () => ctx.toggleSeries(name),
      child: ctx.custom.legend({ name, index: this.#index, isVisible }, ctx),
    });
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = BarChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = BarChartProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = BarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getCategoryLabels(context);
    } else {
      return this.getValueLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const labels = this.#getLabels(context);
    const axis = ctx.custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      ctx,
    );
    return axis;
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = BarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getValueLabels(context);
    } else {
      return this.getCategoryLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const axis = ctx.custom.yAxis(
      {
        labels: this.#getLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
    return axis;
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisLine(undefined, ctx);
  }
}

abstract class Label extends StatelessWidget {
  protected index: number;
  protected name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.index = index;
    this.name = name;
  }
}

class XAxisLabel extends Label {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisLabel({ name: this.name, index: this.index }, ctx);
  }
}

class YAxisLabel extends StatelessWidget {
  #index: number;
  #name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.#index = index;
    this.#name = name;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

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

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.plot(
      { xAxis: new XAxis(), yAxis: new YAxis(), dataView: new DataView(), grid: new Grid(), axisCorner: new AxisCorner(), tooltipArea: new TooltipOverlay() },
      ctx,
    );
  }
}

class DataView extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { data } = ctx;

    return GestureDetector({
      behavior: "translucent",
      onMouseLeave: () => ctx.unhoverAllBars(),
      child: ctx.custom.dataView(
        {
          barGroups: Array.from(
            { length: data.labels.length },
            (_, index) =>
              new BarGroup({
                values: data.datasets.map(({ values }) => values[index]),
                index,
              }),
          ),
        },
        ctx,
      ),
    });
  }
}

class TooltipOverlay extends StatefulWidget {
  createState() {
    return new TooltipOverlayState();
  }
}

class TooltipOverlayState extends State<TooltipOverlay> {
  overlayKey = new GlobalKey();

  private resolveHoveredBar(
    ctx: ReturnType<typeof BarChartProvider.of>,
  ): { index: number; legend: string; value: number; label: string; x: number; y: number; width: number; height: number } | null {
    const hoveredBar = ctx.hoveredBar;
    if (hoveredBar == null) return null;

    const overlayRenderObject = this.overlayKey.currentContext?.renderObject;
    const barRenderObject = hoveredBar.anchorKey.currentContext?.renderObject;
    if (overlayRenderObject == null || barRenderObject == null) return null;

    const dataset = ctx.data.datasets.find((d) => d.legend === hoveredBar.legend);
    if (dataset == null || hoveredBar.index >= dataset.values.length) return null;

    const barGlobal = barRenderObject.localToGlobal();
    const overlayGlobal = overlayRenderObject.localToGlobal();

    return {
      index: hoveredBar.index,
      legend: hoveredBar.legend,
      value: dataset.values[hoveredBar.index],
      label: ctx.data.labels[hoveredBar.index] ?? "",
      x: barGlobal.x - overlayGlobal.x,
      y: barGlobal.y - overlayGlobal.y,
      width: barRenderObject.size.width,
      height: barRenderObject.size.height,
    };
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const hoveredBarRect = this.resolveHoveredBar(ctx);

    let tooltip: Widget | null = null;
    if (hoveredBarRect != null) {
      const legendIdx = ctx.legends.indexOf(hoveredBarRect.legend);
      const colors = ctx.config?.colors ?? [];
      const color = colors[legendIdx % colors.length] ?? "#888";
      tooltip = ctx.custom.tooltip(
        { label: hoveredBarRect.label, items: [{ legend: hoveredBarRect.legend, color, value: hoveredBarRect.value }] },
        ctx,
      );
    }

    return Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        SizedBox({ key: this.overlayKey, width: Infinity, height: Infinity }),
        ctx.custom.tooltipArea(
          { tooltip, hoveredBar: hoveredBarRect },
          ctx,
        ),
      ],
    });
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
