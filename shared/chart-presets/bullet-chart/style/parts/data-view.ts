import type { Widget } from "flitter-ui";
import type { BulletChartCustom } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "../config";
import { BulletDataView } from "../../base/data-view";

export function agDataView(
  ...[args, context]: Parameters<BulletChartCustom<AgBulletChartConfig>["dataView"]>
): Widget {
  return BulletDataView(args, context);
}
