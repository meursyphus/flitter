import { agStylePage } from "../../styles/ag";
import {
  RegionalSalesAg,
  DepartmentHeadcountAg,
  VolatileQuarterlyAg,
  SurveyResponsesAg,
} from "./examples.generated";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "0", description: "Gap between stacked bar groups (px)" },
    ],
  },
];

export const agStyle = agStylePage("stacked-bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <RegionalSalesAg.Component />,
      code: RegionalSalesAg.code,
    },
    {
      title: "Horizontal",
      chart: <DepartmentHeadcountAg.Component />,
      code: DepartmentHeadcountAg.code,
    },
    {
      title: "Negative Vertical",
      chart: <VolatileQuarterlyAg.Component />,
      code: VolatileQuarterlyAg.code,
    },
    {
      title: "Negative Horizontal",
      chart: <SurveyResponsesAg.Component />,
      code: SurveyResponsesAg.code,
    },
  ],
});
