import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import * as Stories from './example';

const meta = {
	title: 'Widget/ZIndex',
	component: Widget,
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: Stories.Basic
};

export const Case1: Story = {
	name: 'Stacking Context/Case1',
	args: Stories.StackingContext.Case1
};
export const Case2: Story = {
	name: 'Stacking Context/Case2',
	args: Stories.StackingContext.Case2
};
export const Case3: Story = {
	name: 'Stacking Context/Case3',
	args: Stories.StackingContext.Case3
};
export const Case4: Story = {
	name: 'Stacking Context/Case4',
	args: Stories.StackingContext.Case4
};
