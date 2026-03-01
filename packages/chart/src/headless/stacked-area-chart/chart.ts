import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
} from "flitter-core";
import { StackedAreaChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
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
    const ctx = StackedAreaChartProvider.of(context);
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
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = StackedAreaChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = StackedAreaChartProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    const labels = this.getCategoryLabels(context);
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
    return ctx.custom.xAxisBox({ child: axis }, ctx);
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    const axis = ctx.custom.yAxis(
      {
        labels: this.getValueLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
    return ctx.custom.yAxisBox({ child: axis }, ctx);
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
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
    const ctx = StackedAreaChartProvider.of(context);
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
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

class Area extends StatelessWidget {
  #values: number[];
  #cumulativeValues: number[];
  #previousCumulative: number[];
  #index: number;
  #legend: string;

  constructor({
    values,
    cumulativeValues,
    previousCumulative,
    index,
    legend,
  }: {
    values: number[];
    cumulativeValues: number[];
    previousCumulative: number[];
    index: number;
    legend: string;
  }) {
    super();
    this.#values = values;
    this.#cumulativeValues = cumulativeValues;
    this.#previousCumulative = previousCumulative;
    this.#index = index;
    this.#legend = legend;
  }

  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.area(
      {
        values: this.#values,
        cumulativeValues: this.#cumulativeValues,
        previousCumulative: this.#previousCumulative,
        legend: this.#legend,
        index: this.#index,
      },
      ctx,
    );
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        series: new Series(),
        grid: new Grid(),
        axisCorner: new AxisCorner(),
      },
      ctx,
    );
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    const { data } = ctx;

    // Build cumulative values for stacking
    const cumulativeByIndex: number[][] = [];
    let previousCumulative: number[] = new Array(
      data.datasets[0]?.values.length ?? 0,
    ).fill(0);

    for (const dataset of data.datasets) {
      const cumulative = dataset.values.map(
        (value, i) => previousCumulative[i] + value,
      );
      cumulativeByIndex.push(cumulative);
      previousCumulative = cumulative;
    }

    return ctx.custom.series(
      {
        areas: data.datasets.map(
          (dataset, index) =>
            new Area({
              values: dataset.values,
              cumulativeValues: cumulativeByIndex[index],
              previousCumulative: index === 0
                ? new Array(dataset.values.length).fill(0)
                : cumulativeByIndex[index - 1],
              index,
              legend: dataset.legend,
            }),
        ),
      },
      ctx,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
