import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";
import { BulletDataView } from "../../../base/data-view";

export function toastDataView(
  ...[args, context]: Parameters<BulletChartCustom<ToastBulletChartConfig>["dataView"]>
): Widget {
  return BulletDataView(args, context);
}
