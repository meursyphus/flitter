import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, ConstraintsTransformBox, LimitedBox } from 'flitter-core';

const meta = {
	title: 'Layout/LimitedBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: ConstraintsTransformBox({
			constraintsTransform: ConstraintsTransformBox.unconstrained,
			child: LimitedBox({
				maxHeight: 200,
				maxWidth: 200,
				child: Container({
					width: Infinity,
					height: Infinity,
					color: 'purple'
				})
			})
		})
	}
};

export const WithinBoundedConstraints: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: LimitedBox({
			maxHeight: 200,
			maxWidth: 200,
			child: Container({
				width: Infinity,
				height: Infinity,
				color: 'purple'
			})
		})
	}
};
