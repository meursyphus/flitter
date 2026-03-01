import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ScatterChart } from "flitter-chart";

const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;
const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;

type ScatterChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
  titlePlacement: (typeof TITLE_OPTIONS)[number];
  legendVisible: boolean;
  legendPosition: (typeof LEGEND_POSITIONS)[number];
  legendGap: number;
  scatterSize: number;
  scatterFill: boolean;
  scatterStrokeWidth: number;
  animationEnabled: boolean;
  animationDuration: number;
};

function parseTitlePlacement(placement: string) {
  const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
  return { position, alignment };
}

const defaultData = {
  datasets: [
    {
      legend: "Africa",
      data: [
        { x: 4200, y: 70.35, label: "Morocco" },
        { x: 4200, y: 70.71, label: "Egypt" },
        { x: 5900, y: 56.46, label: "Gabon" },
        { x: 6600, y: 72.74, label: "Algeria" },
        { x: 6700, y: 76.28, label: "Libya" },
        { x: 7100, y: 74.66, label: "Tunisia" },
        { x: 10500, y: 69.28, label: "Trinidad and Tobago" },
        { x: 12800, y: 72.09, label: "Mauritius" },
        { x: 18200, y: 78.68, label: "Malta" },
      ],
    },
    {
      legend: "America",
      data: [
        { x: 4800, y: 74.64, label: "Paraguay" },
        { x: 4900, y: 70.92, label: "El Salvador" },
        { x: 5600, y: 69.22, label: "Peru" },
        { x: 5800, y: 74.06, label: "Venezuela" },
        { x: 6300, y: 67.63, label: "Dominican Republic" },
        { x: 6500, y: 67.43, label: "Belize" },
        { x: 6600, y: 71.43, label: "Colombia" },
        { x: 6900, y: 72.14, label: "Panama" },
        { x: 8100, y: 71.41, label: "Brazil" },
        { x: 9600, y: 76.63, label: "Costa Rica" },
        { x: 9600, y: 74.94, label: "Mexico" },
        { x: 12400, y: 75.7, label: "Argentina" },
        { x: 14500, y: 75.92, label: "Uruguay" },
        { x: 16400, y: 71.64, label: "Barbados" },
        { x: 17700, y: 65.63, label: "Bahamas, The" },
        { x: 17700, y: 77.49, label: "Puerto Rico" },
        { x: 31500, y: 79.96, label: "Canada" },
        { x: 32100, y: 77.43, label: "United States" },
      ],
    },
    {
      legend: "Asia",
      data: [
        { x: 5600, y: 71.96, label: "China" },
        { x: 5700, y: 61.29, label: "Turkmenistan" },
        { x: 7700, y: 69.66, label: "Iran" },
        { x: 7800, y: 66.07, label: "Kazakhstan" },
        { x: 8100, y: 71.41, label: "Thailand" },
        { x: 9700, y: 71.95, label: "Malaysia" },
        { x: 12000, y: 75.23, label: "Saudi Arabia" },
        { x: 13100, y: 72.85, label: "Oman" },
        { x: 19200, y: 75.58, label: "Korea, South" },
        { x: 19200, y: 73.98, label: "Bahrain" },
        { x: 20800, y: 79.17, label: "Israel" },
        { x: 21300, y: 76.84, label: "Kuwait" },
        { x: 23200, y: 73.4, label: "Qatar" },
        { x: 25200, y: 74.99, label: "United Arab Emirates" },
        { x: 25300, y: 77.06, label: "Taiwan" },
        { x: 27800, y: 81.53, label: "Singapore" },
        { x: 29400, y: 81.04, label: "Japan" },
        { x: 34200, y: 81.39, label: "Hong Kong" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 7700, y: 71.12, label: "Romania" },
        { x: 8200, y: 71.75, label: "Bulgaria" },
        { x: 9800, y: 66.39, label: "Russia" },
        { x: 10700, y: 76.38, label: "Chile" },
        { x: 11200, y: 74.14, label: "Croatia" },
        { x: 11500, y: 70.86, label: "Latvia" },
        { x: 12000, y: 74.16, label: "Poland" },
        { x: 12500, y: 73.46, label: "Lithuania" },
        { x: 14300, y: 71.38, label: "Estonia" },
        { x: 14500, y: 74.19, label: "Slovakia" },
        { x: 14900, y: 72.25, label: "Hungary" },
        { x: 16800, y: 75.78, label: "Czech Republic" },
        { x: 17900, y: 77.35, label: "Portugal" },
        { x: 19600, y: 75.93, label: "Slovenia" },
        { x: 21300, y: 78.94, label: "Greece" },
        { x: 23300, y: 79.37, label: "Spain" },
        { x: 27700, y: 79.54, label: "Italy" },
        { x: 28400, y: 80.3, label: "Sweden" },
        { x: 28700, y: 78.54, label: "Germany" },
        { x: 28700, y: 79.44, label: "France" },
        { x: 29000, y: 78.24, label: "Finland" },
        { x: 29500, y: 78.68, label: "Netherlands" },
        { x: 29600, y: 78.27, label: "United Kingdom" },
        { x: 30600, y: 78.44, label: "Belgium" },
        { x: 31300, y: 78.87, label: "Austria" },
        { x: 31900, y: 77.36, label: "Ireland" },
        { x: 31900, y: 80.18, label: "Iceland" },
        { x: 32200, y: 77.44, label: "Denmark" },
        { x: 33800, y: 80.31, label: "Switzerland" },
      ],
    },
    {
      legend: "Oceania",
      data: [
        { x: 2200, y: 64.56, label: "Papua New Guinea" },
        { x: 2700, y: 61.32, label: "Kiribati" },
        { x: 5900, y: 69.2, label: "Fiji" },
        { x: 14500, y: 78.75, label: "Virgin Islands" },
        { x: 23200, y: 78.49, label: "New Zealand" },
        { x: 30700, y: 80.26, label: "Australia" },
      ],
    },
  ],
};

function ToastScatterChart({ args }: { args: ScatterChartArgs }) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={ScatterChart({
        style: "toast",
        data: defaultData,
        config: {
          title: { text: args.title, position, alignment },
          legend: {
            visible: args.legendVisible,
            position: args.legendPosition,
            gap: args.legendGap,
          },
          scatter: {
            size: args.scatterSize,
            fill: args.scatterFill,
            strokeWidth: args.scatterStrokeWidth,
          },
          animation: {
            enabled: args.animationEnabled,
            duration: args.animationDuration,
          },
        },
      })}
      width="800px"
      height="500px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<ScatterChartArgs> = {
  title: "ScatterChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    titlePlacement: { control: "select", options: TITLE_OPTIONS },
    legendVisible: { control: "boolean" },
    legendPosition: { control: "select", options: LEGEND_POSITIONS },
    legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
    scatterSize: { control: { type: "range", min: 2, max: 30, step: 1 } },
    scatterFill: { control: "boolean" },
    scatterStrokeWidth: { control: { type: "range", min: 1, max: 6, step: 0.5 } },
    animationEnabled: { control: "boolean" },
    animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
  args: {
    renderer: "svg",
    title: "GDP per Capita vs Life Expectancy",
    titlePlacement: "top-center",
    legendVisible: true,
    legendPosition: "bottom",
    legendGap: 12,
    scatterSize: 10,
    scatterFill: false,
    scatterStrokeWidth: 2,
    animationEnabled: true,
    animationDuration: 300,
  },
};

export default meta;
type Story = StoryObj<ScatterChartArgs>;

export const Default: Story = {
  render: (args) => <ToastScatterChart args={args} />,
};
