import * as Cartesian from "@shared/cartesian/index";

export { BulletGroup } from "./bullet-group";
export { BulletDataView } from "./data-view";
export { BulletGrid } from "./grid";
export { Plot } from "@shared/cartesian/plot";

export const defaultGetScale = (
  data: { datasets: { value: number; target: number; ranges: number[] }[] },
  options?: { roughStepCount?: number },
) => {
  const allValues = data.datasets.map((d) => [
    ...d.ranges,
    d.value,
    d.target,
  ]);
  return Cartesian.getScale(
    { datasets: allValues.map((values) => ({ values, legend: "" })) },
    options,
  );
};
