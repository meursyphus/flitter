import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { SunburstConfigProvider } from "./provider";

class SunburstChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new LayoutWidget();
  }
}

export default SunburstChart;

class LayoutWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = SunburstConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        sunburst: new SunburstWidget(),
        legend: new LegendWidget(),
      },
      config,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = SunburstConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class LegendWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = SunburstConfigProvider.of(context);
    const { custom, data } = config;
    const children = data.root.children ?? [];
    const items = children.map(
      (child, index) =>
        new LegendItemWidget({
          label: child.label,
          color: child.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        }),
    );
    return custom.legend({ items }, config);
  }
}

class LegendItemWidget extends StatelessWidget {
  #label: string;
  #color: string;

  constructor({ label, color }: { label: string; color: string }) {
    super();
    this.#label = label;
    this.#color = color;
  }

  override build(context: BuildContext): Widget {
    const config = SunburstConfigProvider.of(context);
    const { custom } = config;
    return custom.legendItem(
      { label: this.#label, color: this.#color },
      config,
    );
  }
}

class SunburstWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = SunburstConfigProvider.of(context);
    const { custom, segments } = config;
    return custom.sunburst({ segments }, config);
  }
}

const DEFAULT_COLORS = [
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
