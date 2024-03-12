import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { BasicStory } from './examples';

const meta = {
	title: 'Widget/Draggable',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	},
	args: {
		width: '400px',
		height: '400px',
		ssrSize: { width: 400, height: 400 }
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};
