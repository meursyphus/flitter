import type { Widget } from "flitter-ui";
import type { BulletChartCustom } from "flitter-ui/chart";
import type { ToastBulletChartConfig } from "../config";
import { BulletDataView } from "../../base/data-view";

export function toastDataView(
  ...[args, context]: Parameters<BulletChartCustom<ToastBulletChartConfig>["dataView"]>
): Widget {
  return BulletDataView(args, context);
}
