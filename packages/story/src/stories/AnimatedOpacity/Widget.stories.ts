import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { BasicStory } from './example';

const meta = {
	title: 'Widget/AnimatedOpacity',
	component: Widget,
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};
