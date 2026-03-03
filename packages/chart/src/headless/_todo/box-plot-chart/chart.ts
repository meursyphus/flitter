import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { BoxPlotChartConfigProvider } from "./provider";
import type { BoxPlotDataPoint } from "./types";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default Chart;

class Layout extends StatelessWidget {
  #getLegends(context: BuildContext): string[] {
    const { data } = BoxPlotChartConfigProvider.of(context);
    return data.datasets.map(({ legend }) => legend);
  }

  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
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
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.legend({ name: this.#name, index: this.#index }, config);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const {
      scale: { min, max, step },
    } = BoxPlotChartConfigProvider.of(context);
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = BoxPlotChartConfigProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    const labels = this.getCategoryLabels(context);
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
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLine(undefined, config);
  }
}

class YAxis extends Axis {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxis(
      {
        labels: this.getValueLabels(context).map(
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
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLine(undefined, config);
  }
}

class XAxisLabel extends StatelessWidget {
  #index: number;
  #name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.#index = index;
    this.#name = name;
  }

  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLabel({ name: this.#name, index: this.#index }, config);
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
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLabel({ name: this.#name, index: this.#index }, config);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisTick(undefined, config);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisTick(undefined, config);
  }
}

class BoxPlotGroup extends StatelessWidget {
  #dataPoints: BoxPlotDataPoint[];
  #index: number;

  constructor({ dataPoints, index }: { dataPoints: BoxPlotDataPoint[]; index: number }) {
    super();
    this.#dataPoints = dataPoints;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.boxPlotGroup(
      {
        index: this.#index,
        label: data.labels[this.#index],
        dataPoints: this.#dataPoints,
        boxPlots: this.#dataPoints.map(
          (dataPoint, datasetIndex) =>
            new BoxPlot({
              dataPoint,
              index: this.#index,
              legend: data.datasets[datasetIndex].legend,
              label: data.labels[this.#index],
            }),
        ),
      },
      config,
    );
  }
}

class BoxPlot extends StatelessWidget {
  #dataPoint: BoxPlotDataPoint;
  #index: number;
  #legend: string;
  #label: string;

  constructor({
    dataPoint,
    index,
    legend,
    label,
  }: {
    dataPoint: BoxPlotDataPoint;
    index: number;
    legend: string;
    label: string;
  }) {
    super();
    this.#dataPoint = dataPoint;
    this.#index = index;
    this.#legend = legend;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.boxPlot(
      {
        dataPoint: this.#dataPoint,
        index: this.#index,
        legend: this.#legend,
        label: this.#label,
      },
      config,
    );
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.axisCorner(undefined, config);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.plot(
      { xAxis: new XAxis(), yAxis: new YAxis(), dataView: new DataView(), grid: new Grid(), axisCorner: new AxisCorner() },
      config,
    );
  }
}

class DataView extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.dataView(
      {
        boxPlotGroups: Array.from(
          { length: data.labels.length },
          (_, index) =>
            new BoxPlotGroup({
              dataPoints: data.datasets.map(({ data: d }) => d[index]),
              index,
            }),
        ),
      },
      config,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      config,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridXLine(undefined, config);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = BoxPlotChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridYLine(undefined, config);
  }
}
