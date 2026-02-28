import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
} from "flitter-core";
import { StackedBarChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
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
    const ctx = StackedBarChartProvider.of(context);
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
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.title({ name: ctx.title }, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = StackedBarChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = StackedBarChartProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = StackedBarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getCategoryLabels(context);
    } else {
      return this.getValueLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    const labels = this.#getLabels(context);
    return ctx.custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      ctx,
    );
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = StackedBarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getValueLabels(context);
    } else {
      return this.getCategoryLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.yAxis(
      {
        labels: this.#getLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
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
    const ctx = StackedBarChartProvider.of(context);
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
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
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
    const ctx = StackedBarChartProvider.of(context);
    const { data } = ctx;
    return ctx.custom.barGroup(
      {
        index: this.#index,
        label: data.labels[this.#index],
        values: this.#values,
        bars: this.#values.map(
          (value, index) =>
            new Bar({
              value,
              index: this.#index,
              legend: data.datasets[index].legend,
              label: data.labels[this.#index],
            }),
        ),
      },
      ctx,
    );
  }
}

class Bar extends StatelessWidget {
  #value: number;
  #index: number;
  #legend: string;
  #label: string;

  constructor({
    value,
    index,
    legend,
    label,
  }: {
    value: number;
    index: number;
    legend: string;
    label: string;
  }) {
    super();
    this.#value = value;
    this.#index = index;
    this.#legend = legend;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.bar(
      {
        value: this.#value,
        index: this.#index,
        legend: this.#legend,
        label: this.#label,
      },
      ctx,
    );
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.plot(
      { xAxis: new XAxis(), yAxis: new YAxis(), series: new Series(), grid: new Grid(), axisCorner: new AxisCorner() },
      ctx,
    );
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    const { data } = ctx;
    return ctx.custom.series(
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
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedBarChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
