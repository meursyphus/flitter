import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, ConstrainedBox, Constraints } from 'flitter-core';

const meta = {
	title: 'Layout/ConstrainedBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

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
