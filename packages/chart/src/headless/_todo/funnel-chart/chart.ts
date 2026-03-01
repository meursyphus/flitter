import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { FunnelChartConfigProvider } from "./provider";

class FunnelChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default FunnelChart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        funnel: new FunnelWidget(),
        legends: data.stages.map(
          (stage, index) => new LegendWidget({ index }),
        ),
      },
      config,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class LegendWidget extends StatelessWidget {
  #index: number;

  constructor({ index }: { index: number }) {
    super();
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    const stage = data.stages[this.#index];
    const defaultColors = [
      "#4e79a7",
      "#f28e2b",
      "#e15759",
      "#76b7b2",
      "#59a14f",
      "#edc948",
      "#b07aa1",
      "#ff9da7",
      "#9c755f",
      "#bab0ac",
    ];
    const color =
      stage.color ?? defaultColors[this.#index % defaultColors.length];
    return custom.legend(
      { label: stage.label, color, index: this.#index },
      config,
    );
  }
}

class FunnelWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    const maxValue = Math.max(...data.stages.map((s) => s.value));

    const stages = data.stages.map(
      (_, index) => new StageWidget({ index, maxValue }),
    );

    return custom.funnel({ stages }, config);
  }
}

class StageWidget extends StatelessWidget {
  #index: number;
  #maxValue: number;

  constructor({ index, maxValue }: { index: number; maxValue: number }) {
    super();
    this.#index = index;
    this.#maxValue = maxValue;
  }

  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    const stage = data.stages[this.#index];
    const ratio = this.#maxValue > 0 ? stage.value / this.#maxValue : 0;
    const defaultColors = [
      "#4e79a7",
      "#f28e2b",
      "#e15759",
      "#76b7b2",
      "#59a14f",
      "#edc948",
      "#b07aa1",
      "#ff9da7",
      "#9c755f",
      "#bab0ac",
    ];
    const color =
      stage.color ?? defaultColors[this.#index % defaultColors.length];

    const firstValue = data.stages[0]?.value ?? 1;
    const percentage =
      firstValue > 0 ? (stage.value / firstValue) * 100 : 0;

    return custom.stage(
      {
        index: this.#index,
        label: stage.label,
        value: stage.value,
        ratio,
        color,
        stageLabel: new StageLabelWidget({ index: this.#index }),
        dataLabel: new DataLabelWidget({
          index: this.#index,
          percentage,
        }),
      },
      config,
    );
  }
}

class StageLabelWidget extends StatelessWidget {
  #index: number;

  constructor({ index }: { index: number }) {
    super();
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    const stage = data.stages[this.#index];
    return custom.stageLabel(
      { label: stage.label, index: this.#index },
      config,
    );
  }
}

class DataLabelWidget extends StatelessWidget {
  #index: number;
  #percentage: number;

  constructor({
    index,
    percentage,
  }: {
    index: number;
    percentage: number;
  }) {
    super();
    this.#index = index;
    this.#percentage = percentage;
  }

  override build(context: BuildContext): Widget {
    const config = FunnelChartConfigProvider.of(context);
    const { custom, data } = config;
    const stage = data.stages[this.#index];
    return custom.dataLabel(
      {
        value: stage.value,
        percentage: this.#percentage,
        label: stage.label,
        index: this.#index,
      },
      config,
    );
  }
}
