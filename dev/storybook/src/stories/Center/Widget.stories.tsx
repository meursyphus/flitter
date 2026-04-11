import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Center } from 'flitter-core';

const meta = {
	title: 'Layout/Center',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

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
