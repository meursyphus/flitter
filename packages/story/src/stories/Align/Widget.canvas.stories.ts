import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import {
	Container,
	Align,
	Alignment,
	ConstrainedBox,
	Constraints,
	ConstraintsTransformBox,
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Align/canvas',
	component: Widget,
	argTypes: {}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Align({
			child: Container({
				width: 200,
				height: 200,
				color: 'orange'
			})
		})
	}
};

export const ChildConstraintsBeLoosened: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: ConstrainedBox({
			constraints: Constraints.tight({ width: 600, height: 300 }),
			child: Align({
				child: Container({
					width: 200,
					height: 200,
					color: 'orange'
				})
			})
		}),
		description: 'This widget loosen parent constraints so child does not expand'
	}
};

export const UnderUnconstrained: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: ConstraintsTransformBox({
			constraintsTransform: ConstraintsTransformBox.unconstrained,
			alignment: Alignment.topLeft,
			child: Align({
				child: Container({
					width: 200,
					height: 200,
					color: 'orange'
				})
			})
		}),
		description: 'Under unbounded constraints, This widget match its child size.'
	}
};

export const WithFactorProps: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Align({
			widthFactor: 2,
			heightFactor: 1.2,
			child: Container({
				width: 200,
				height: 200,
				color: 'orange'
			})
		}),
		description: dedent`
			With factorProps, This widget will match the size witch is multiplied child size by given factorProps
			It works regardless of boundedness
		`
	}
};
