import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastSunburstChart } from "shared/chart";

type StoryArgs = {
	renderer: "svg" | "canvas";
};

const storageData = {
	nodes: [
		{
			label: "Documents",
			value: 29,
			children: [
				{ label: "Pages", value: 9, children: [] },
				{ label: "Keynote", value: 11, children: [] },
				{ label: "Numbers", value: 9, children: [] },
			],
		},
		{
			label: "Media",
			value: 42,
			children: [
				{ label: "Photos", value: 18, children: [] },
				{ label: "Videos", value: 24, children: [] },
			],
		},
		{
			label: "Downloads",
			value: 18,
			children: [
				{ label: "Recent", value: 7, children: [] },
				{ label: "Archive", value: 11, children: [] },
			],
		},
	],
};

const meta: Meta<StoryArgs> = {
	title: "Charts/SunburstChart/Toast",
	parameters: { layout: "centered" },
	args: { renderer: "svg" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
	},
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
	render: (args) => (
		<Widget
			widget={ToastSunburstChart({
				data: storageData,
				config: {
					title: {
						text: "Used disk space",
						visible: true,
					},
				},
			})}
			width="620px"
			height="460px"
			renderer={args.renderer}
		/>
	),
};
