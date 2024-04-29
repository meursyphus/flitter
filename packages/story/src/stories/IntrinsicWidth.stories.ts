import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '@meursyphus/flitter-svelte';
import {
	Alignment,
	Column,
	Container,
	CrossAxisAlignment,
	IntrinsicWidth,
	MainAxisAlignment
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/IntrinsicWidth',
	component: Widget,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/7.0/svelte/configure/story-layout
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Case1: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			color: 'grey',
			child: IntrinsicWidth({
				child: Column({
					mainAxisAlignment: MainAxisAlignment.spaceBetween,
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						Container({
							height: 50,
							width: 50,
							color: 'red'
						}),
						Container({
							height: 50,
							width: 200,
							color: 'green'
						}),
						Container({
							height: 50,
							width: 100,
							color: 'blue'
						})
					]
				})
			})
		})
	}
};
