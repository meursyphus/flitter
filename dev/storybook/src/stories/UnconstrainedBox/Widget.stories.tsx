import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Align, Alignment, UnconstrainedBox } from 'flitter-core';

const meta = {
	title: 'Layout/UnconstrainedBox',
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
			child: Container({
				width: 200,
				height: 200,
				color: 'grey',
				child: UnconstrainedBox({
					constrainedAxis: 'horizontal',
					child: Container({ width: 50, height: 50, color: 'orange' })
				})
			})
		})
	}
};
