import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, FractionallySizedBox, Center, Row, Flexible } from 'flitter-core';

const meta = {
	title: 'Layout/FractionallySizedBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: FractionallySizedBox({
				widthFactor: 0.5,
				heightFactor: 0.5,
				child: Container({ color: 'orange' })
			})
		})
	}
};

export const Whitespace: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'white',
				child: Row({
					children: [
						Container({ width: 50, height: 50, color: 'green' }),
						Flexible({
							child: FractionallySizedBox({ widthFactor: 0.3 })
						}),
						Container({ width: 100, height: 100, color: 'red' })
					]
				})
			})
		})
	}
};
