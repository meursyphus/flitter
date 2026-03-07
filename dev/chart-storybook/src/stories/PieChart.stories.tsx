import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { PieChart } from "chart-styles";

const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;
const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type PieChartArgs = {
	renderer: "svg" | "canvas";
	title: string;
	titlePlacement: (typeof TITLE_OPTIONS)[number];
	legendVisible: boolean;
	legendPosition: (typeof LEGEND_POSITIONS)[number];
	legendGap: number;
	strokeColor: string;
	strokeWidth: number;
	innerRadiusRatio: number;
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

function ToastPieChart({ args }: { args: PieChartArgs }) {
	const { position, alignment } = parseTitlePlacement(args.titlePlacement);
	return (
		<Widget
			widget={PieChart({
				data: defaultData,
				config: {
					title: { text: args.title, position, alignment },
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
				},
			})}
			width="500px"
			height="400px"
			renderer={args.renderer}
		/>
	);
}

const meta: Meta<PieChartArgs> = {
	title: "Charts/PieChart/Toast",
	parameters: { layout: "centered" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
		title: { control: "text" },
		titlePlacement: { control: "select", options: TITLE_OPTIONS },
		legendVisible: { control: "boolean" },
		legendPosition: { control: "select", options: LEGEND_POSITIONS },
		legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
		strokeColor: { control: "color" },
		strokeWidth: { control: { type: "range", min: 0, max: 6, step: 0.5 } },
		innerRadiusRatio: { control: { type: "range", min: 0, max: 0.9, step: 0.05 } },
	},
	args: {
		renderer: "svg",
		title: "Browser Usage Share",
		titlePlacement: "top-start",
		legendVisible: true,
		legendPosition: "right-top",
		legendGap: 12,
		strokeColor: "white",
		strokeWidth: 2,
		innerRadiusRatio: 0,
	},
};

export default meta;
type Story = StoryObj<PieChartArgs>;

export const Default: Story = {
	render: (args) => <ToastPieChart args={args} />,
};

export const Donut: Story = {
	args: {
		innerRadiusRatio: 0.5,
		title: "Browser Usage (Donut)",
	},
	render: (args) => <ToastPieChart args={args} />,
};
