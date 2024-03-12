import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, ConstrainedBox, Constraints } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, ConstrainedBox, Constraints } from '@meursyphus/flitter';
\n\n`;
const meta = {
	title: 'Widget/ConstrainedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	ConstrainedBox({
		constraints: new Constraints({ maxWidth: 200, maxHeight: 200 }),
		child: Container({
			width: Infinity,
			height: Infinity,
			color: 'green'
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
			constraints: new Constraints({ maxWidth: 200, maxHeight: 200 }),
			child: Container({
				width: Infinity,
				height: Infinity,
				color: 'green'
			})
		})
	}
};
