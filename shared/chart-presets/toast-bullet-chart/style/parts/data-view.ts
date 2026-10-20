import type { Widget } from "flitterjs";
import type { BulletChartCustom } from "@flitterjs/chart";
import type { ToastBulletChartConfig } from "../config";
import { BulletDataView } from "../../base/data-view";

export function toastDataView(
  ...[args, context]: Parameters<BulletChartCustom<ToastBulletChartConfig>["dataView"]>
): Widget {
  return BulletDataView(args, context);
}
