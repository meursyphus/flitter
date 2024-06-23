import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Container,
	ConstraintsTransformBox,
	Constraints,
	ConstrainedBox,
	Alignment
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/ConstraintsTransformBox',
	component: Widget
} satisfies Meta<Widget>;

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
