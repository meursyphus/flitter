import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;
const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type RadarChartArgs = {
	renderer: "svg" | "canvas";
	title: string;
	titlePlacement: (typeof TITLE_OPTIONS)[number];
	legendVisible: boolean;
	legendPosition: (typeof LEGEND_POSITIONS)[number];
	legendGap: number;
	fillOpacity: number;
	strokeWidth: number;
	gridColor: string;
	gridWidth: number;
};

function parseTitlePlacement(placement: string) {
	const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
	return { position, alignment };
}

const skillData = {
	labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
	datasets: [
		{ legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
		{ legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
		{ legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
	],
};

const meta: Meta<RadarChartArgs> = {
	title: "In-Review/RadarChart/Toast",
	parameters: { layout: "centered" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
		title: { control: "text" },
		titlePlacement: { control: "select", options: TITLE_OPTIONS },
		legendVisible: { control: "boolean" },
		legendPosition: { control: "select", options: LEGEND_POSITIONS },
		legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
		fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		strokeWidth: { control: { type: "range", min: 0, max: 6, step: 0.5 } },
		gridColor: { control: "color" },
		gridWidth: { control: { type: "range", min: 0, max: 4, step: 0.5 } },
	},
	args: {
		renderer: "svg",
		title: "Developer Skills",
		titlePlacement: "top-start",
		legendVisible: true,
		legendPosition: "right-top",
		legendGap: 12,
		fillOpacity: 0.3,
		strokeWidth: 2,
		gridColor: "rgba(0, 0, 0, 0.1)",
		gridWidth: 1,
	},
};

export default meta;
type Story = StoryObj<RadarChartArgs>;

export const Default: Story = {
	render: (args) => {
		const { position, alignment } = parseTitlePlacement(args.titlePlacement);
		return (
			<Widget
				widget={ToastRadarChart({
					data: skillData,
					config: {
						title: { text: args.title, position, alignment },
						legend: {
							visible: args.legendVisible,
							position: args.legendPosition,
							gap: args.legendGap,
						},
						radar: {
							fillOpacity: args.fillOpacity,
							strokeWidth: args.strokeWidth,
							gridColor: args.gridColor,
							gridWidth: args.gridWidth,
						},
					},
				})}
				width="500px"
				height="400px"
				renderer={args.renderer}
			/>
		);
	},
};
