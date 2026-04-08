import { SizedBox, type Widget } from "flitter-core";
import * as Cartesian from "@shared/cartesian/index";
import type { BulletChartCustom } from "@headless/bullet-chart/types";

export { BulletGroup } from "./bullet-group";
export { BulletBox } from "./bullet-box";
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

export function BulletTooltip(
  ..._args: Parameters<BulletChartCustom["tooltip"]>
): Widget {
  return SizedBox.shrink();
}

export function BulletTooltipArea(
  ..._args: Parameters<BulletChartCustom["tooltipArea"]>
): Widget {
  return SizedBox.shrink();
}
