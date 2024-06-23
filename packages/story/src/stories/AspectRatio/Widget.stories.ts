import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Alignment, AspectRatio } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/AspectRatio',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {
	args: {
		width: '400px',
		height: '300px',
		widget: Container({
			width: Infinity,
			height: 150,
			color: 'orange',
			alignment: Alignment.center,
			child: AspectRatio({
				aspectRatio: 16 / 9,
				child: Container({
					color: 'purple'
				})
			})
		})
	}
};
