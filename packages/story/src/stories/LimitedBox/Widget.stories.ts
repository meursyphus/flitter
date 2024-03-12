import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, ConstraintsTransformBox, LimitedBox } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, ConstraintsTransformBox, LimitedBox } from '@meursyphus/flitter';
\n\n`;
const meta = {
	title: 'Widget/LimitedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	ConstraintsTransformBox({
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
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code: importWidgets + BasicWidget,
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
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code: importWidgets + BasicWidget,
		widget: LimitedBox({
			maxHeight: 200,
			maxWidth: 200,
			child: Container({
				width: Infinity,
				height: Infinity,
				color: 'purple'
			})
		}),
		description: dedent`
			LimitedBox doesn't work within bounded constraints.
		`
	}
};
