import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, SizedBox, Align, OverflowBox, Alignment } from 'flitter-core';

const meta = {
	title: 'Layout/OverflowBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '500px',
		height: '600px',
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				width: 400,
				height: 400,
				alignment: Alignment.topLeft,
				color: 'grey',
				child: SizedBox({
					width: 200,
					height: 200,
					child: OverflowBox({
						maxWidth: Infinity,
						maxHeight: Infinity,
						child: Container({
							color: 'red',
							width: 400,
							height: 400
						})
					})
				})
			})
		})
	}
};
