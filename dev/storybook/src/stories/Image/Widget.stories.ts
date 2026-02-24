import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from './image-story.svelte';

const meta = {
	title: 'Widget/Image',
	component: Widget,
	parameters: {
		layout: 'fullscreen',
		chromatic: { disableSnapshot: true }
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {};
