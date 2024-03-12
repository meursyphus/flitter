import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Align, Alignment, Row, Spacer } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, Align, Alignment, Row, Spacer } from '@meursyphus/flitter';
\n\n`;

const meta = {
	title: 'Widget/Spacer',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Align({
		alignment: Alignment.center,
		child: Container({
			color: 'lightblue',
			child: Row({
				children: [
					Container({
						color: 'blue',
						height: 50,
						width: 50
					}),
					Spacer(),
					Container({
						color: 'green',
						height: 50,
						width: 50
					}),
				]
			})
		})
	})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code: importWidgets + BasicWidget,
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				color: 'lightblue',
				child: Row({
					children: [
						Container({
							color: 'blue',
							height: 50,
							width: 50
						}),
						Spacer(),
						Container({
							color: 'green',
							height: 50,
							width: 50
						})
					]
				})
			})
		})
	}
};
