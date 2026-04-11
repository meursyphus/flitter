import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;
const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type HeatmapChartArgs = {
	renderer: "svg" | "canvas";
	title: string;
	titlePlacement: (typeof TITLE_OPTIONS)[number];
	legendVisible: boolean;
	legendPosition: (typeof LEGEND_POSITIONS)[number];
	legendGap: number;
	segmentGap: number;
	animationEnabled: boolean;
	animationDuration: number;
};

function parseTitlePlacement(placement: string) {
	const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
	return { position, alignment };
}

const defaultData = {
	xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	values: [
		[2, 5, 8, 12, 18, 24, 28, 30, 25, 16, 9, 4],
		[3, 6, 9, 13, 19, 25, 29, 31, 26, 17, 10, 5],
		[4, 7, 11, 15, 21, 27, 32, 34, 28, 19, 12, 6],
		[5, 8, 12, 16, 22, 28, 33, 35, 29, 20, 13, 7],
		[4, 7, 10, 14, 20, 26, 31, 33, 27, 18, 11, 6],
		[3, 5, 8, 11, 17, 23, 27, 29, 24, 15, 9, 4],
		[2, 4, 7, 10, 16, 22, 26, 28, 23, 14, 8, 3],
	],
};

function ToastHeatmapChartStory({ args }: { args: HeatmapChartArgs }) {
	const { position, alignment } = parseTitlePlacement(args.titlePlacement);
	return (
		<Widget
			widget={ToastHeatmapChart({
				data: defaultData,
				config: {
					title: { text: args.title, position, alignment },
					legend: {
						visible: args.legendVisible,
						position: args.legendPosition,
						gap: args.legendGap,
					},
					heatmap: {
						segment: { gap: args.segmentGap },
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

const meta: Meta<HeatmapChartArgs> = {
	title: "Charts/HeatmapChart/Toast",
	parameters: { layout: "centered" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
		title: { control: "text" },
		titlePlacement: { control: "select", options: TITLE_OPTIONS },
		legendVisible: { control: "boolean" },
		legendPosition: { control: "select", options: LEGEND_POSITIONS },
		legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
		segmentGap: { control: { type: "range", min: 0, max: 6, step: 1 } },
		animationEnabled: { control: "boolean" },
		animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
	},
	args: {
		renderer: "svg",
		title: "Average Daily Temperature (°C)",
		titlePlacement: "top-center",
		legendVisible: true,
		legendPosition: "bottom",
		legendGap: 12,
		segmentGap: 0,
		animationEnabled: true,
		animationDuration: 300,
	},
};

export default meta;
type Story = StoryObj<HeatmapChartArgs>;

export const Default: Story = {
	render: (args) => <ToastHeatmapChartStory args={args} />,
};
