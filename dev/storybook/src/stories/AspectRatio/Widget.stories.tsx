import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Alignment, AspectRatio } from 'flitter-core';

const meta = {
	title: 'Layout/AspectRatio',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

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
