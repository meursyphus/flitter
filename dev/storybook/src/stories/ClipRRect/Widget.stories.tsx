import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, ClipRRect, BorderRadius, Radius, Center } from 'flitter-core';

const meta = {
	title: 'Painting/ClipRRect',
	component: DualRenderer,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof DualRenderer>;

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
