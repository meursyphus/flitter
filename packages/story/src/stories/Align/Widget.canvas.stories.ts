import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import {
	Container,
	Align,
	Alignment,
	ConstrainedBox,
	Constraints,
	ConstraintsTransformBox
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Align/canvas',
	component: Widget,
	argTypes: {}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Align({
		child: Container({
			width: 200,
			height: 200,
			color: 'orange'
		})
	})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Container, Align, Alignment } from '@meursyphus/flitter'\n\n\n` + BasicWidget,
		widget: Align({
			child: Container({
				width: 200,
				height: 200,
				color: 'orange'
			})
		})
	}
};

const ChildConstraintsBeLoosenedWidget = dedent`
	ConstrainedBox({
		constraints: Constraints.tight({ width: 600, height: 300 }),
		child: Align({
			child: Container({
				width: 200,
				height: 200,
				color: 'orange'
			})
	})
`;

export const ChildConstraintsBeLoosened: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Container, Align, ConstrainedBox, Constraints } from '@meursyphus/flitter'\n\n\n` +
			ChildConstraintsBeLoosenedWidget,
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

const UnderUnconstrainedWidget = dedent`
	ConstraintsTransformBox({
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
`;

export const UnderUnconstrained: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Container, Align, ConstraintsTransformBox, Alignment } from '@meursyphus/flitter'\n\n\n` +
			UnderUnconstrainedWidget,
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

const WithFactorPropsWidget = dedent`
	Align({
		widthFactor: 2,
		heightFactor: 1.2,
		child: Container({
			width: 200,
			height: 200,
			color: 'orange'
		})
	}),
`;

export const WithFactorProps: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Container, Align } from '@meursyphus/flitter'\n\n\n` + WithFactorPropsWidget,
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
