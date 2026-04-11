import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";
import { BulletDataView } from "../../../base/data-view";

export function agDataView(
  ...[args, context]: Parameters<BulletChartCustom<AgBulletChartConfig>["dataView"]>
): Widget {
  return BulletDataView(args, context);
}
