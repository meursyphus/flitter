import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { PieChartConfigProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default Chart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = PieChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.layout(
      {
        title: new Title(),
        pie: new Pie(),
        legends: data.labels.map(
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
    const config = PieChartConfigProvider.of(context);
    const { custom } = config;
    return custom.legend({ name: this.#name, index: this.#index }, config);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = PieChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class Pie extends StatelessWidget {
  #computeSliceAngles(context: BuildContext): { startAngle: number; sweepAngle: number; percentage: number }[] {
    const { data } = PieChartConfigProvider.of(context);
    const total = data.values.reduce((sum, v) => sum + v, 0);
    let currentAngle = -Math.PI / 2;
    return data.values.map((value) => {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const sweepAngle = total > 0 ? (value / total) * Math.PI * 2 : 0;
      const startAngle = currentAngle;
      currentAngle += sweepAngle;
      return { startAngle, sweepAngle, percentage };
    });
  }

  override build(context: BuildContext): Widget {
    const config = PieChartConfigProvider.of(context);
    const { custom, data } = config;
    const angles = this.#computeSliceAngles(context);

    const slices = data.values.map(
      (value, index) =>
        new Slice({
          index,
          label: data.labels[index],
          value,
          percentage: angles[index].percentage,
          startAngle: angles[index].startAngle,
          sweepAngle: angles[index].sweepAngle,
        }),
    );

    const dataLabels = data.values.map(
      (value, index) =>
        new DataLabel({
          label: data.labels[index],
          value,
          percentage: angles[index].percentage,
          index,
        }),
    );

    return custom.pie({ slices, dataLabels }, config);
  }
}

class Slice extends StatelessWidget {
  #index: number;
  #label: string;
  #value: number;
  #percentage: number;
  #startAngle: number;
  #sweepAngle: number;

  constructor({
    index,
    label,
    value,
    percentage,
    startAngle,
    sweepAngle,
  }: {
    index: number;
    label: string;
    value: number;
    percentage: number;
    startAngle: number;
    sweepAngle: number;
  }) {
    super();
    this.#index = index;
    this.#label = label;
    this.#value = value;
    this.#percentage = percentage;
    this.#startAngle = startAngle;
    this.#sweepAngle = sweepAngle;
  }

  override build(context: BuildContext): Widget {
    const config = PieChartConfigProvider.of(context);
    const { custom } = config;
    return custom.slice(
      {
        index: this.#index,
        label: this.#label,
        value: this.#value,
        percentage: this.#percentage,
        startAngle: this.#startAngle,
        sweepAngle: this.#sweepAngle,
      },
      config,
    );
  }
}

class DataLabel extends StatelessWidget {
  #label: string;
  #value: number;
  #percentage: number;
  #index: number;

  constructor({
    label,
    value,
    percentage,
    index,
  }: {
    label: string;
    value: number;
    percentage: number;
    index: number;
  }) {
    super();
    this.#label = label;
    this.#value = value;
    this.#percentage = percentage;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = PieChartConfigProvider.of(context);
    const { custom } = config;
    return custom.dataLabel(
      {
        label: this.#label,
        value: this.#value,
        percentage: this.#percentage,
        index: this.#index,
      },
      config,
    );
  }
}
