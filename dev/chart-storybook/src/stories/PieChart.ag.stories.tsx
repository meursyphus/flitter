import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;
const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type PieChartArgs = {
	renderer: "svg" | "canvas";
	title: string;
	subtitle: string;
	titlePlacement: (typeof TITLE_OPTIONS)[number];
	legendVisible: boolean;
	legendPosition: (typeof LEGEND_POSITIONS)[number];
	legendGap: number;
	strokeColor: string;
	strokeWidth: number;
	innerRadiusRatio: number;
	dataLabelVisible: boolean;
	dataLabelFontSize: number;
	dataLabelFontColor: string;
	dataLabelOffset: number;
};

function parseTitlePlacement(placement: string) {
	const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
	return { position, alignment };
}

const defaultData = {
	datasets: [
		{ name: "Chrome", value: 65 },
		{ name: "Safari", value: 18 },
		{ name: "Firefox", value: 8 },
		{ name: "Edge", value: 5 },
		{ name: "Other", value: 4 },
	],
};

function AgPieChart({ args }: { args: PieChartArgs }) {
	const { position, alignment } = parseTitlePlacement(args.titlePlacement);
	return (
		<Widget
			widget={PieChart({
				data: defaultData,
				config: {
					title: { text: args.title, position, alignment },
					subtitle: {
						text: args.subtitle,
						visible: !!args.subtitle,
					},
					legend: {
						visible: args.legendVisible,
						position: args.legendPosition,
						gap: args.legendGap,
					},
					pie: {
						strokeColor: args.strokeColor,
						strokeWidth: args.strokeWidth,
						innerRadiusRatio: args.innerRadiusRatio,
					},
					dataLabel: {
						visible: args.dataLabelVisible,
						fontSize: args.dataLabelFontSize,
						fontColor: args.dataLabelFontColor,
						offset: args.dataLabelOffset,
					},
				},
			})}
			width="700px"
			height="550px"
			renderer={args.renderer}
		/>
	);
}

const meta: Meta<PieChartArgs> = {
	title: "Charts/PieChart/Ag",
	parameters: { layout: "centered" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
		title: { control: "text" },
		subtitle: { control: "text" },
		titlePlacement: { control: "select", options: TITLE_OPTIONS },
		legendVisible: { control: "boolean" },
		legendPosition: { control: "select", options: LEGEND_POSITIONS },
		legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
		strokeColor: { control: "color" },
		strokeWidth: { control: { type: "range", min: 0, max: 6, step: 0.5 } },
		innerRadiusRatio: { control: { type: "range", min: 0, max: 0.9, step: 0.05 } },
		dataLabelVisible: { control: "boolean" },
		dataLabelFontSize: { control: { type: "range", min: 8, max: 24, step: 1 } },
		dataLabelFontColor: { control: "color" },
		dataLabelOffset: { control: { type: "range", min: 5, max: 50, step: 1 } },
	},
	args: {
		renderer: "svg",
		title: "Browser Usage Share",
		subtitle: "2024 Global Statistics",
		titlePlacement: "top-center",
		legendVisible: false,
		legendPosition: "right-top",
		legendGap: 16,
		strokeColor: "white",
		strokeWidth: 2,
		innerRadiusRatio: 0,
		dataLabelVisible: true,
		dataLabelFontSize: 16,
		dataLabelFontColor: "#333333",
		dataLabelOffset: 20,
	},
};

export default meta;
type Story = StoryObj<PieChartArgs>;

export const Default: Story = {
	render: (args) => <AgPieChart args={args} />,
};

export const Donut: Story = {
	args: {
		innerRadiusRatio: 0.5,
		title: "Browser Usage (Donut)",
		subtitle: "2024 Global Statistics",
	},
	render: (args) => <AgPieChart args={args} />,
};
