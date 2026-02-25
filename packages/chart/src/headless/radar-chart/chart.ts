import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { RadarChartConfigProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new LayoutWidget();
  }
}

export default Chart;

class LayoutWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = RadarChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        radar: new RadarWidget(),
        legends: data.datasets.map(
          (ds, index) => new LegendWidget({ name: ds.legend, index })
        ),
      },
      config
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = RadarChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class LegendWidget extends StatelessWidget {
  #name: string;
  #index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.#name = name;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = RadarChartConfigProvider.of(context);
    const { custom } = config;
    return custom.legend({ name: this.#name, index: this.#index }, config);
  }
}

class RadarWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = RadarChartConfigProvider.of(context);
    const { custom, scale } = config;
    const levels = Math.round((scale.max - scale.min) / scale.step);
    return custom.radar(
      {
        grid: custom.grid({ levels }, config),
        axes: custom.axis({ index: -1, label: "" }, config),
        datasets: custom.dataset({ values: [], legend: "", index: -1 }, config),
        axisLabels: custom.axisLabel({ index: -1, label: "" }, config),
      },
      config
    );
  }
}
