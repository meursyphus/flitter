import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import {
	Container,
	ConstraintsTransformBox,
	Constraints,
	ConstrainedBox,
	Alignment
} from 'flitter-core';

const meta = {
	title: 'Layout/ConstraintsTransformBox',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: ConstrainedBox({
			constraints: Constraints.tightFor({ width: 400, height: 400 }),
			child: ConstraintsTransformBox({
				alignment: Alignment.center,
				constraintsTransform: (constraints) => constraints.loosen(),
				child: Container({
					color: 'blue',
					width: 200,
					height: 200
				})
			})
		})
	}
};
