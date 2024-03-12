import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Align, Alignment, UnconstrainedBox } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, UnconstrainedBox, Align, Alignment } from '@meursyphus/flitter';
\n\n`;

const meta = {
	title: 'Widget/UnconstrainedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Align({
		alignment: Alignment.center,
		child: Container({
			width: 200,
			height: 200,
			color: 'grey',
			child: UnconstrainedBox({
				constrainedAxis: 'horizontal',
				child: Container({
					width: 50,
					height: 50,
					color: 'orange'
				})
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
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				width: 200,
				height: 200,
				color: 'grey',
				child: UnconstrainedBox({
					constrainedAxis: 'horizontal',
					child: Container({
						width: 50,
						height: 50,
						color: 'orange'
					})
				})
			})
		})
	}
};
