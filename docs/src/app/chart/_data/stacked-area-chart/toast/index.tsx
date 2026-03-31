import { toastStylePage } from "../../styles/toast";
import { DefaultToastStackedAreaChart, TrafficSourceStackedArea, RevenueStreamStackedArea, AcquisitionChannelsToast } from "./examples.generated";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.6", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const toastStyle = toastStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastStackedAreaChart.Component />,
      code: DefaultToastStackedAreaChart.code,
    },
    {
      title: "Traffic by Source",
      chart: <TrafficSourceStackedArea.Component />,
      code: TrafficSourceStackedArea.code,
    },
    {
      title: "Revenue Streams",
      chart: <RevenueStreamStackedArea.Component />,
      code: RevenueStreamStackedArea.code,
    },
    {
      title: "Acquisition Channels",
      chart: <AcquisitionChannelsToast.Component />,
      code: AcquisitionChannelsToast.code,
    },
  ],
});
