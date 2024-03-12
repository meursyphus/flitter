import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, SizedBox, Align, OverflowBox, Alignment } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, SizedBox, Align, OverflowBox, Alignment } from '@meursyphus/flitter';
\n\n`;
const meta = {
	title: 'Widget/OverflowBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Align({
		alignment: Alignment.center,
		child: Container({
			width: 400,
			height: 400,
			alignment: Alignment.topLeft,
			color: 'grey',
			child: SizedBox({
				width: 200,
				height: 200,
				child: OverflowBox({
					maxWidth: Infinity,
					maxHeight: Infinity,
					child: Container({
						color: 'red',
						width: 400,
						height: 400
					})
				})
			})
		})
	})
`;
export const Basic: Story = {
	args: {
		ssrSize: { width: 500, height: 600 },
		width: '500px',
		height: '600px',
		code: importWidgets + BasicWidget,
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				width: 400,
				height: 400,
				alignment: Alignment.topLeft,
				color: 'grey',
				child: SizedBox({
					width: 200,
					height: 200,
					child: OverflowBox({
						maxWidth: Infinity,
						maxHeight: Infinity,
						child: Container({
							color: 'red',
							width: 400,
							height: 400
						})
					})
				})
			})
		})
	}
};
