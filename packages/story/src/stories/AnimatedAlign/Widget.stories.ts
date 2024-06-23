import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { BasicStory } from './example/index.js';

const meta = {
	title: 'Widget/AnimatedAlign',
	component: Widget,
	args: {
		width: '600px',
		height: '300px'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};
