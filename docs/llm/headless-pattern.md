# Headless Pattern

`flitter-chart` headless charts follow a fixed 5-file structure:

1. `types.ts`
2. `controller.ts`
3. `provider.ts`
4. `chart.ts`
5. `index.ts`

Reference implementations:

- Cartesian: `packages/chart/src/headless/bar-chart/`
- Non-cartesian: `packages/chart/src/headless/pie-chart/`

## 1. `types.ts`

Each chart defines:

- `ChartContext<TConfig>`: controller instance plus `config`
- `ChartCustom<TConfig>`: every render slot
- `ChartData`
- `ChartScale` if the chart uses a numeric axis

Minimal shape:

```ts
import type { Widget } from "flitter-core";
import type { ExampleChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
  args: T,
  context: ExampleChartContext<TConfig>,
) => Widget;

export type ExampleChartContext<TConfig = {}> = ExampleChartController & {
  config: TConfig;
};

export type ExampleChartCustom<TConfig = {}> = {
  layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
  dataView: CustomArgs<{ items: Widget[] }, TConfig>;
  item: CustomArgs<{ value: number; index: number }, TConfig>;
  legend: CustomArgs<{ name: string; index: number }, TConfig>;
  title: CustomArgs<undefined, TConfig>;
};
```

## 2. `controller.ts`

Controller owns all mutable chart state:

- raw data
- derived scale/layout
- width and height from `LayoutBuilder`
- hover state
- legend filtering

Guidelines:

- keep visual concerns out of the controller
- expose derived getters like `scale`, `bins`, `segments`, `layout`
- recalculate derived state in one private method
- call `notifyListeners()` only after state is consistent

Minimal shape:

```ts
export class ExampleChartController extends ChangeNotifier {
  #rawData: ExampleChartData;
  #width = 0;
  #height = 0;
  #hoveredIndex: number | null = null;

  custom!: ExampleChartCustom<any>;
  config: any;

  set data(value: ExampleChartData) {
    this.#rawData = value;
    this.#recalculate();
    this.notifyListeners();
  }

  setSize(width: number, height: number) {
    if (this.#width === width && this.#height === height) return;
    this.#width = width;
    this.#height = height;
    this.#recalculate();
    this.notifyListeners();
  }
}
```

## 3. `provider.ts`

Always use `ChangeNotifierProvider` for headless charts.

```ts
const EXAMPLE_CHART_KEY = Symbol("ExampleChartKey");

export function ExampleChartProvider({ custom, data, config = {} }: Props): Widget {
  return ChangeNotifierProvider({
    providerKey: EXAMPLE_CHART_KEY,
    create: () => new ExampleChartController({ data, custom, config }),
    update: (notifier) => {
      const controller = notifier as ExampleChartController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}
```

## 4. `chart.ts`

`chart.ts` does composition only.

- `LayoutBuilder` updates width and height
- leaf widgets call slot functions
- axis label generation lives here
- data iteration lives here
- controller stays out of widget composition details

Do not put any fixed colors, padding, font choices, or animation curves here.

## 5. `index.ts`

`index.ts` is always the thin public entry point:

```ts
export default function ExampleChart<TConfig = {}>(props: {
  custom: ExampleChartCustom<TConfig>;
  data: ExampleChartData;
  config?: TConfig;
}): Widget {
  return ExampleChartProvider(props as any);
}
```

## Custom Slot Design

Rules:

- every slot should receive the minimum data needed to render
- pass child widgets rather than raw data when composition matters
- prefer slot names that match actual chart concepts: `bar`, `slice`, `node`, `connector`
- keep `layout`, `legend`, `title`, and `dataView` stable across charts

## Controller Design

Use controller methods for:

- `setSize`
- `toggleSeries`
- `showAllSeries`
- `hoverX`
- `unhoverX`

Use getters for:

- `scale`
- `legends`
- `visibleData`
- `layout`
- `segments`
- `bins`

## Build A Donut Chart

1. Copy `packages/chart/src/headless/pie-chart/`.
2. Rename types to `DonutChart*`.
3. Add `centerContent` to `DonutChartCustom`.
4. Add `innerRadiusRatio` to the controller.
5. Keep `slice` slot compatible with pie.
6. In `chart.ts`, compute slices exactly like pie, then pass an extra `centerContent` widget into `dataView`.
7. In `index.ts`, expose `innerRadiusRatio?: number`.

Minimal delta:

```ts
centerContent: CustomArgs<{ total: number }, TConfig>;
```

```ts
return ctx.custom.dataView({
  slices,
  centerContent: ctx.custom.centerContent({ total }, ctx),
}, ctx);
```
