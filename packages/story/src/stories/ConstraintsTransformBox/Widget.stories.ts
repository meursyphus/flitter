import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import {
	Container,
	ConstraintsTransformBox,
	Constraints,
	ConstrainedBox,
	Alignment
} from '@meursyphus/flitter';

const importWidgets = dedent`import {
	Container,
	ConstraintsTransformBox,
	Constraints,
	ConstrainedBox,
	Alignment
} from '@meursyphus/flitter'
\n\n`;
const meta = {
	title: 'Widget/ConstraintsTransformBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	ConstrainedBox({
		constraints: Constraints.tightFor({ width: 400, height: 400 }),
		child: ConstraintsTransformBox({
			constraintsTransform: (constraints) => constraints.loosen(),
			child: Container({
				color: 'blue',
				width: 200,
				height: 200
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
