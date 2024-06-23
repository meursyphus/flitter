import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, ConstraintsTransformBox, LimitedBox } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/LimitedBox',
	component: Widget
} satisfies Meta<Widget>;

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
