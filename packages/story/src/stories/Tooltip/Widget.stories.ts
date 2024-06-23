import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { BasicStory, ConstrainedTightStory } from './example/index.js';

const meta = {
	title: 'Widget/Tooltip',
	component: Widget,
	args: {
		width: '400px',
		height: '400px'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};

export const ConstrainedTight: Story = {
	args: ConstrainedTightStory
};
