import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Center } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Center',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				width: 200,
				height: 200,
				color: 'orange'
			})
		})
	}
};
