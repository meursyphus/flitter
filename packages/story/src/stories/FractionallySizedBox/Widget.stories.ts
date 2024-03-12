import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, FractionallySizedBox, Center, Row, Flexible } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/FractionallySizedBox',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
	Center({
		child: FractionallySizedBox({
			widthFactor: 0.5,
			heightFactor: 0.5,
			child: Container({
				color: 'orange'
			})
		})
	})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Center, FractionallySizedBox, Container } from '@meursyphus/flitter'\n\n\n` +
			BasicWidget,
		widget: Center({
			child: FractionallySizedBox({
				widthFactor: 0.5,
				heightFactor: 0.5,
				child: Container({
					color: 'orange'
				})
			})
		})
	}
};

const WhitespaceCode = dedent`
	Center({
		child: Container({
			color: 'white',
			child: Row({
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'green'
					}),
					Flexible({
						child: FractionallySizedBox({
							widthFactor: 0.2
						})
					}),
					Container({
						width: 100,
						height: 100,
						color: 'red'
					})
				]
			})
		})
	})
`;

export const Whitespace: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code:
			dedent`import { Container, Row, FractionallySizedBox, Flexible } from '@meursyphus/flitter'\n\n\n` +
			WhitespaceCode,
		widget: Center({
			child: Container({
				color: 'white',
				child: Row({
					children: [
						Container({
							width: 50,
							height: 50,
							color: 'green'
						}),
						Flexible({
							child: FractionallySizedBox({
								widthFactor: 0.3
							})
						}),
						Container({
							width: 100,
							height: 100,
							color: 'red'
						})
					]
				})
			})
		})
	}
};
