import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, SizedBox, Align, Alignment } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, SizedBox, Align, Alignment } from '@meursyphus/flitter';
\n\n`;

const meta = {
	title: 'Widget/SizedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Align({
		alignment: Alignment.center,
		child: SizedBox({
			width: 200,
			height: 200,
			child: Container({
				width: 0,
				height: 0,
				color: 'orange'
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
			child: SizedBox({
				width: 200,
				height: 200,
				child: Container({
					width: 0,
					height: 0,
					color: 'orange'
				})
			})
		})
	}
};
