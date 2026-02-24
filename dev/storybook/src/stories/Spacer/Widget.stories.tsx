import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Align, Alignment, Row, Spacer } from 'flitter-core';

const meta = {
	title: 'Layout/Spacer',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				color: 'lightblue',
				child: Row({
					children: [
						Container({ color: 'blue', height: 50, width: 50 }),
						Spacer(),
						Container({ color: 'green', height: 50, width: 50 })
					]
				})
			})
		})
	}
};
