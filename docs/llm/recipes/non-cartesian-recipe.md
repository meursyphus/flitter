# Non-Cartesian Recipe

Build a pie-like chart by starting from `Headless.PieChart`.

```ts
import { Headless } from "flitter-chart";
import { Column, Expanded, Container } from "flitter-core";

const custom = {
  layout: ({ title, legends, dataView }) =>
    Column({
      children: [
        title,
        Expanded({ child: dataView }),
      ],
    }),
  dataView: ({ slices }) =>
    Container({
      width: Infinity,
      height: Infinity,
      child: slices[0]?.widget ?? Container({}),
    }),
  slice: ({ index, name, value, percentage }) =>
    Container({
      width: 120,
      height: 120,
      color: index % 2 === 0 ? "#00a9ff" : "#ffb840",
    }),
  legend: ({ name }) => Container({}),
  title: () => Container({}),
};

Headless.PieChart({
  data: {
    datasets: [
      { name: "A", value: 42 },
      { name: "B", value: 28 },
      { name: "C", value: 18 },
    ],
  },
  custom,
});
```

Use the same structure for:

- `DonutChart`

Swap only the chart-specific slots.
