import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, SizedBox, Align, Alignment } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/SizedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Align({
			alignment: Alignment.center,
			child: SizedBox({
				width: 200,
				height: 200,
				child: Container({
					width: 0,
					height: 0,
					color: 'orange'
				})
			})
		})
	}
};
