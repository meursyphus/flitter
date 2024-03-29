import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '@meursyphus/flitter-svelte';
import { Alignment, Container, IntrinsicHeight, Row } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/IntrinsicHeight',
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
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			color: 'grey',
			child: IntrinsicHeight({
				child: Row({
					mainAxisAlignment: 'spaceBetween',
					crossAxisAlignment: 'stretch',
					children: [
						Container({
							width: 50,
							height: 50,
							color: 'red'
						}),
						Container({
							width: 50,
							height: 200,
							color: 'green'
						}),
						Container({
							width: 50,
							height: 100,
							color: 'blue'
						})
					]
				})
			})
		})
	}
};
