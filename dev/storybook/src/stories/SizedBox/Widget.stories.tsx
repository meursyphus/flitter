import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, SizedBox, Align, Alignment } from 'flitter-core';

const meta = {
	title: 'Layout/SizedBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

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
				child: Container({ width: 0, height: 0, color: 'orange' })
			})
		})
	}
};
