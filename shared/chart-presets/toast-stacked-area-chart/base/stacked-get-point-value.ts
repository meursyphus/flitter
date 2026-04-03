import type { GetPointValueFn } from "flitter-ui/chart";

export const stackedGetPointValue: GetPointValueFn = ({ data, index, legend }) => {
  const datasetIndex = data.datasets.findIndex((dataset) => dataset.legend === legend);
  if (datasetIndex < 0) return null;

  let cumulative = 0;
  for (let i = 0; i <= datasetIndex; i++) {
    cumulative += data.datasets[i].values[index] ?? 0;
  }

  return cumulative;
};
