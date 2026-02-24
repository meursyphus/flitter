import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { AreaChartConfigProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default Chart;

class Layout extends StatelessWidget {
  #getLegends(context: BuildContext): string[] {
    const { data } = AreaChartConfigProvider.of(context);
    return data.datasets.map(({ legend }) => legend);
  }

  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new Title(),
        plot: new Plot(),
        legends: this.#getLegends(context).map(
          (name, index) => new Legend({ name, index }),
        ),
      },
      config,
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
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.legend({ name: this.#name, index: this.#index }, config);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const {
      scale: { min, max, step },
    } = AreaChartConfigProvider.of(context);
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = AreaChartConfigProvider.of(context);
    return data.labels;
  }
  protected getLabels(context: BuildContext): string[] {
    const { data } = AreaChartConfigProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    return this.getCategoryLabels(context);
  }

  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    const labels = this.#getLabels(context);
    return custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      config,
    );
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLine(undefined, config);
  }
}

class YAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    return this.getValueLabels(context);
  }

  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxis(
      {
        labels: this.#getLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      config,
    );
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLine(undefined, config);
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
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLabel({ name: this.name, index: this.index }, config);
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
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLabel({ name: this.#name, index: this.#index }, config);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisTick(undefined, config);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisTick(undefined, config);
  }
}

class Line extends StatelessWidget {
  #values: number[];
  #index: number;
  #legend: string;

  constructor({
    values,
    index,
    legend,
  }: {
    values: number[];
    index: number;
    legend: string;
  }) {
    super();
    this.#values = values;
    this.#index = index;
    this.#legend = legend;
  }

  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.area(
      {
        values: this.#values,
        legend: this.#legend,
        index: this.#index,
      },
      config,
    );
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        series: new Series(),
        grid: new Grid(),
      },
      config,
    );
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.series(
      {
        areas: data.datasets.map(
          (dataset, index) =>
            new Line({
              values: dataset.values,
              index,
              legend: dataset.legend,
            }),
        ),
      },
      config,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      config,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridXLine(undefined, config);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = AreaChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridYLine(undefined, config);
  }
}
