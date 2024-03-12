import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '@meursyphus/flitter-svelte';
import { Container, Text, Alignment, EdgeInsets } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Container',
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
			color: 'lightblue'
		})
		// description: 'if container has no child, it would be stretched as possibe as it can be'
	}
};
export const Case2: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Text('text', { style: { fontSize: '30px' } })
		})
		// description: 'if container has child, it would be shirinked in order to fit child'
	}
};
export const Case3: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			padding: EdgeInsets.all(10),
			child: Container({
				color: 'green',
				child: Text('child in blue container')
			})
		})
		// description: `if container has width and height,
		// it pass tight constraint that means any child in this component would be stretched as possible as it can be`
	}
};
export const Case4: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			padding: EdgeInsets.all(10),
			alignment: Alignment.center,
			child: Container({
				color: 'green',
				child: Text('child')
			})
		})
		// 	description: `although the container is in tight constraint(including that it have own width and height),
		//  containter with alignment loosen constraint. so child dont have to be expanded`
	}
};
