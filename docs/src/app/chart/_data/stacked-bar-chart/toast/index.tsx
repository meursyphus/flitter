import { toastStylePage } from "../../styles/toast";
import {
  RegionalRevenueToast,
  HorizontalCategoryToast,
  ProductPLMixToast,
  EmployeeDistributionToast,
} from "./examples.generated";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "0", description: "Gap between stacked bar groups (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("stacked-bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <RegionalRevenueToast.Component />,
      code: RegionalRevenueToast.code,
    },
    {
      title: "Horizontal",
      chart: <HorizontalCategoryToast.Component />,
      code: HorizontalCategoryToast.code,
    },
    {
      title: "Negative Vertical",
      chart: <ProductPLMixToast.Component />,
      code: ProductPLMixToast.code,
    },
    {
      title: "Negative Horizontal",
      chart: <EmployeeDistributionToast.Component />,
      code: EmployeeDistributionToast.code,
    },
  ],
});
