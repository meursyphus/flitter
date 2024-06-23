import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, ClipRRect, BorderRadius, Radius, Center } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/ClipRRect',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: ClipRRect({
				borderRadius: BorderRadius.all(Radius.circular(40)),
				child: Container({
					color: 'red',
					width: 200,
					height: 200
				})
			})
		})
	}
};
