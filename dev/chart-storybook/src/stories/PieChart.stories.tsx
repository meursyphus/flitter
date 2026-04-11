import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;
const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type PieChartArgs = {
	renderer: "svg" | "canvas";
	title: string;
	titlePlacement: (typeof TITLE_OPTIONS)[number];
	legendVisible: boolean;
	legendPosition: (typeof LEGEND_POSITIONS)[number];
	legendGap: number;
	radialVisible: boolean;
	radialGap: number;
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

function ToastPieChartStory({ args }: { args: PieChartArgs }) {
	const { position, alignment } = parseTitlePlacement(args.titlePlacement);
	return (
		<Widget
			widget={ToastPieChart({
				data: defaultData,
				config: {
					title: { text: args.title, position, alignment },
					legend: {
						visible: args.legendVisible,
						position: args.legendPosition,
						gap: args.legendGap,
					},
					pie: {
						innerRadiusRatio: 0,
					},
					radial: {
						visible: args.radialVisible,
						gap: args.radialGap,
					},
				},
			})}
			width="600px"
			height="500px"
			renderer={args.renderer}
		/>
	);
}

const meta: Meta<PieChartArgs> = {
	title: "CHARTS/PieChart/Toast",
	parameters: { layout: "centered" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
		title: { control: "text" },
		titlePlacement: { control: "select", options: TITLE_OPTIONS },
		legendVisible: { control: "boolean" },
		legendPosition: { control: "select", options: LEGEND_POSITIONS },
		legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
		radialVisible: { control: "boolean" },
		radialGap: { control: { type: "range", min: 0, max: 20, step: 1 } },
	},
	args: {
		renderer: "svg",
		title: "Browser Usage Share",
		titlePlacement: "top-start",
		legendVisible: true,
		legendPosition: "right-top",
		legendGap: 12,
		radialVisible: false,
		radialGap: 8,
	},
};

export default meta;
type Story = StoryObj<PieChartArgs>;

export const Default: Story = {
	render: (args) => <ToastPieChartStory args={args} />,
};

export const RadialVisible: Story = {
	args: {
		radialVisible: true,
	},
	render: (args) => <ToastPieChartStory args={args} />,
};
