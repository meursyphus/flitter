import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Align, Alignment, Row, Expanded, Spacer } from '@meursyphus/flitter';

const importWidgets = dedent`import { Container, Align, Alignment, Row, Expanded, Spacer } from '@meursyphus/flitter';
\n\n`;

const meta = {
	title: 'Widget/Expanded',
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
					Spacer({ flex: 0.5 }),
					Expanded({
						flex: 1,
						child: Container({
							color: 'orange',
							height: 50
						})
					}),
					Spacer({ flex: 0.5 }),
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
						Spacer({ flex: 0.5 }),
						Expanded({
							flex: 1,
							child: Container({
								color: 'orange',
								height: 50
							})
						}),
						Spacer({ flex: 0.5 })
					]
				})
			})
		})
	}
};
