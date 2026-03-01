import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { TreemapConfigProvider } from "./provider";

class TreemapChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new LayoutWidget();
  }
}

export default TreemapChart;

class LayoutWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        legend: new LegendWidget(),
        treemap: new TreemapWidget(),
      },
      config,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class LegendWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom, data, colors } = config;
    const items = data.nodes.map(
      (node, index) =>
        new LegendItemWidget({
          label: node.label,
          color: colors[index % colors.length],
          index,
        }),
    );
    return custom.legend({ items }, config);
  }
}

class LegendItemWidget extends StatelessWidget {
  #label: string;
  #color: string;
  #index: number;

  constructor({
    label,
    color,
    index,
  }: {
    label: string;
    color: string;
    index: number;
  }) {
    super();
    this.#label = label;
    this.#color = color;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom } = config;
    return custom.legendItem(
      { label: this.#label, color: this.#color, index: this.#index },
      config,
    );
  }
}

class TreemapWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom, data, colors, layouts } = config;
    const total = data.nodes.reduce((sum, n) => sum + n.value, 0);

    const nodes = data.nodes.map((node, index) => {
      const layout = layouts[index];
      const color = node.color ?? colors[index % colors.length];
      return new NodeWidget({
        label: node.label,
        value: node.value,
        color,
        index,
        ratio: total > 0 ? node.value / total : 0,
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      });
    });

    return custom.treemap({ nodes }, config);
  }
}

class NodeWidget extends StatelessWidget {
  #label: string;
  #value: number;
  #color: string;
  #index: number;
  #ratio: number;
  #x: number;
  #y: number;
  #width: number;
  #height: number;

  constructor(props: {
    label: string;
    value: number;
    color: string;
    index: number;
    ratio: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    super();
    this.#label = props.label;
    this.#value = props.value;
    this.#color = props.color;
    this.#index = props.index;
    this.#ratio = props.ratio;
    this.#x = props.x;
    this.#y = props.y;
    this.#width = props.width;
    this.#height = props.height;
  }

  override build(context: BuildContext): Widget {
    const config = TreemapConfigProvider.of(context);
    const { custom } = config;
    return custom.node(
      {
        label: this.#label,
        value: this.#value,
        color: this.#color,
        index: this.#index,
        ratio: this.#ratio,
        x: this.#x,
        y: this.#y,
        width: this.#width,
        height: this.#height,
      },
      config,
    );
  }
}
