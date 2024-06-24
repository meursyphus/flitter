import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, ConstrainedBox, Constraints } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/ConstrainedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: ConstrainedBox({
			constraints: new Constraints({ maxWidth: 200, maxHeight: 200 }),
			child: Container({
				width: Infinity,
				height: Infinity,
				color: 'green'
			})
		})
	}
};
