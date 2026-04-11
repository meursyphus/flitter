import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Align, Alignment, Row, Expanded, Spacer } from 'flitter-core';

const meta = {
	title: 'Layout/Expanded',
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
						Spacer({ flex: 0.5 }),
						Expanded({
							flex: 1,
							child: Container({
								color: 'orange',
								height: 50
							})
						}),
						Spacer({ flex: 0.5 })
					]
				})
			})
		})
	}
};
