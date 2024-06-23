import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Align, Alignment, UnconstrainedBox } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/UnconstrainedBox',
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
			child: Container({
				width: 200,
				height: 200,
				color: 'grey',
				child: UnconstrainedBox({
					constrainedAxis: 'horizontal',
					child: Container({
						width: 50,
						height: 50,
						color: 'orange'
					})
				})
			})
		})
	}
};
