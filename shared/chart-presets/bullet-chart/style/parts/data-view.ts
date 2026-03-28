import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "../config";
import { BulletDataView } from "../../base/data-view";
import { AgBulletTooltipOverlay } from "./tooltip-overlay";

export function agDataView(
  ...[args, context]: Parameters<BulletChartCustom<AgBulletChartConfig>["dataView"]>
): Widget {
  const child = BulletDataView(args, context);
  return AgBulletTooltipOverlay({ child, context });
}
