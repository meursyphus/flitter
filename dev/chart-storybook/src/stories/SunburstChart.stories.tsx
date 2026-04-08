import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { SunburstChart } from "shared/chart";

type StoryArgs = {
	renderer: "svg" | "canvas";
};

const orgData = {
	nodes: [
		{
			label: "Engineering",
			value: 65,
			children: [
				{ label: "Frontend", value: 30, children: [] },
				{ label: "Backend", value: 25, children: [] },
				{ label: "DevOps", value: 10, children: [] },
			],
		},
		{
			label: "Design",
			value: 23,
			children: [
				{ label: "UI/UX", value: 15, children: [] },
				{ label: "Brand", value: 8, children: [] },
			],
		},
		{
			label: "Sales",
			value: 32,
			children: [
				{ label: "Domestic", value: 20, children: [] },
				{ label: "International", value: 12, children: [] },
			],
		},
	],
};

const deepData = {
	nodes: [
		{
			label: "A",
			value: 39,
			children: [
				{
					label: "A-1",
					value: 21,
					children: [
						{ label: "A-1-a", value: 12, children: [] },
						{ label: "A-1-b", value: 9, children: [] },
					],
				},
				{ label: "A-2", value: 18, children: [] },
			],
		},
		{
			label: "B",
			value: 25,
			children: [
				{ label: "B-1", value: 14, children: [] },
				{ label: "B-2", value: 11, children: [] },
			],
		},
	],
};

const meta: Meta<StoryArgs> = {
	title: "Charts/SunburstChart/Ag",
	parameters: { layout: "centered" },
	args: { renderer: "svg" },
	argTypes: {
		renderer: { control: "inline-radio", options: ["svg", "canvas"] },
	},
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Organization: Story = {
	render: (args) => (
		<Widget
			widget={SunburstChart({
				data: orgData,
				config: {
					title: {
						text: "Company structure",
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

export const DeepHierarchy: Story = {
	render: (args) => (
		<Widget
			widget={SunburstChart({
				data: deepData,
				config: {
					title: {
						text: "Nested hierarchy",
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
