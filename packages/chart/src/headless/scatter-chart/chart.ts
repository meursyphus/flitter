import { StatelessWidget, Widget, BuildContext } from "flitter-core";
import { ScatterChartConfigProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default Chart;

class Layout extends StatelessWidget {
  #getLegends(context: BuildContext): string[] {
    const { data } = ScatterChartConfigProvider.of(context);
    return data.datasets.map(({ legend }) => legend);
  }

  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        legends: this.#getLegends(context).map(
          (name, index) => new Legend({ name, index }),
        ),
        plot: new Plot(),
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
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.legend({ name: this.#name, index: this.#index }, config);
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.axisCorner(undefined, config);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        series: new Series(),
        grid: new Grid(),
        axisCorner: new AxisCorner(),
      },
      config,
    );
  }
}

class XAxis extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    const { scale } = config;
    const xSteps = (scale.x.max - scale.x.min) / scale.x.step;
    const labels = [];
    for (let i = 0; i <= xSteps; i++) {
      labels.push(scale.x.min + i * scale.x.step);
    }

    return custom.xAxis(
      {
        labels: labels.map(
          (name, index) => new XAxisLabel({ name: `${name}`, index }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      config,
    );
  }
}

class YAxis extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    const { scale } = config;
    const ySteps = (scale.y.max - scale.y.min) / scale.y.step;
    const labels = [];
    for (let i = 0; i <= ySteps; i++) {
      labels.push(scale.y.min + i * scale.y.step);
    }

    return custom.yAxis(
      {
        labels: labels.map(
          (name, index) => new YAxisLabel({ name: `${name}`, index }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      config,
    );
  }
}

class AxisLabel extends StatelessWidget {
  #name: string;
  #index: number;
  #renderer: (args: any, config: any) => Widget;

  constructor({
    name,
    index,
    renderer,
  }: {
    name: string;
    index: number;
    renderer: (args: any, config: any) => Widget;
  }) {
    super();
    this.#name = name;
    this.#index = index;
    this.#renderer = renderer;
  }

  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    return this.#renderer({ name: this.#name, index: this.#index }, config);
  }
}

class XAxisLabel extends AxisLabel {
  constructor({ name, index }: { name: string; index: number }) {
    super({
      name,
      index,
      renderer: (args, config) => config.custom.xAxisLabel(args, config),
    });
  }
}

class YAxisLabel extends AxisLabel {
  constructor({ name, index }: { name: string; index: number }) {
    super({
      name,
      index,
      renderer: (args, config) => config.custom.yAxisLabel(args, config),
    });
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisTick(undefined, config);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisTick(undefined, config);
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLine(undefined, config);
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLine(undefined, config);
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom, data, scale } = config;

    // 모든 dataset의 points를 하나의 배열로 합치기
    const points = data.datasets.flatMap((dataset, datasetIndex) =>
      dataset.data.map((pt) => ({
        ...pt,
        legend: dataset.legend,
        index: datasetIndex,
      })),
    );

    // custom.series에 { points, scale } 형태로 전달
    return custom.series({ points, scale }, config);
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.grid(
      {
        xLine: new GridXLine(),
        yLine: new GridYLine(),
      },
      config,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridXLine(undefined, config);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = ScatterChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridYLine(undefined, config);
  }
}
